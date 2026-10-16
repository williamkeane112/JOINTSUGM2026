
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const ANON_KEY =
  Deno.env.get("SUPABASE_ANON_KEY") ??
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
  "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

type SubmittedAnswer = {
  session_question_id: string;
  answer: string;
  response_time_ms?: number;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method tidak diizinkan." }, 405);
  }

  if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
    return json({ error: "Konfigurasi Supabase belum lengkap." }, 500);
  }

  const authorization = req.headers.get("Authorization");
  if (!authorization) {
    return json({ error: "Silakan login terlebih dahulu." }, 401);
  }

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { data: authData, error: authError } =
      await userClient.auth.getUser();

    if (authError || !authData.user) {
      return json({ error: "Sesi login tidak valid." }, 401);
    }

    const user = authData.user;
    const body = await req.json();

    const sessionId =
      typeof body.session_id === "string" ? body.session_id.trim() : "";

    if (!sessionId || !Array.isArray(body.answers)) {
      return json({
        error: "session_id dan array answers wajib diisi.",
      }, 400);
    }

    const answers = body.answers as SubmittedAnswer[];

    if (answers.length !== 10) {
      return json({ error: "Jawaban harus berjumlah tepat 10." }, 400);
    }

    const validIds = new Set<string>();

    for (const item of answers) {
      if (
        !item ||
        typeof item.session_question_id !== "string" ||
        !item.session_question_id.trim() ||
        !["A", "B", "C", "D"].includes(item.answer) ||
        (
          item.response_time_ms !== undefined &&
          (
            !Number.isInteger(item.response_time_ms) ||
            item.response_time_ms < 0
          )
        )
      ) {
        return json({ error: "Format jawaban tidak valid." }, 400);
      }

      if (validIds.has(item.session_question_id)) {
        return json({ error: "Ada soal yang dikirim lebih dari sekali." }, 400);
      }

      validIds.add(item.session_question_id);
    }

    // Pastikan sesi dimiliki siswa dan belum pernah dikumpulkan.
    const { data: session, error: sessionError } = await admin
      .from("quiz_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (sessionError) throw sessionError;
    if (!session) {
      return json({ error: "Sesi checkpoint tidak ditemukan." }, 404);
    }

    if (session.status !== "in_progress") {
      return json({
        error: "Sesi ini sudah dikumpulkan atau tidak dapat dikerjakan.",
      }, 409);
    }

    const { data: questions, error: questionsError } = await admin
      .from("quiz_session_questions")
      .select(
        "id, session_id, question_order, skill_key, difficulty_level",
      )
      .eq("session_id", sessionId)
      .order("question_order", { ascending: true });

    if (questionsError) throw questionsError;

    if (!questions || questions.length !== 10) {
      return json({ error: "Data soal checkpoint tidak lengkap." }, 409);
    }

    const questionIds = new Set(questions.map((q) => q.id));

    if (
      validIds.size !== questions.length ||
      answers.some((answer) => !questionIds.has(answer.session_question_id))
    ) {
      return json({
        error: "Jawaban harus cocok dengan 10 soal pada sesi ini.",
      }, 400);
    }

    const { data: answerKeys, error: keysError } = await admin
      .from("quiz_session_answer_keys")
      .select("session_question_id, correct_answer, explanation")
      .in("session_question_id", questions.map((q) => q.id));

    if (keysError) throw keysError;

    const keyMap = new Map(
      (answerKeys ?? []).map((key) => [key.session_question_id, key]),
    );

    if (keyMap.size !== 10) {
      return json({ error: "Kunci jawaban tidak lengkap." }, 500);
    }

    const answerMap = new Map(
      answers.map((answer) => [answer.session_question_id, answer]),
    );

    let correctCount = 0;

    const graded = questions.map((question) => {
      const submitted = answerMap.get(question.id)!;
      const key = keyMap.get(question.id)!;

      // correct_answer disimpan sebagai JSON string, misalnya "A".
      const correctAnswer =
        typeof key.correct_answer === "string"
          ? key.correct_answer
          : String(key.correct_answer);

      const isCorrect = submitted.answer === correctAnswer;

      if (isCorrect) correctCount++;

      return {
        question,
        submitted,
        key,
        isCorrect,
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= Number(session.passing_score ?? 70);
    const now = new Date().toISOString();

    // Simpan jawaban siswa pada snapshot pertanyaan.
    for (const item of graded) {
      const { error } = await admin
        .from("quiz_session_questions")
        .update({
          student_answer: item.submitted.answer,
          is_correct: item.isCorrect,
          response_time_ms: item.submitted.response_time_ms ?? null,
          answered_at: now,
        })
        .eq("id", item.question.id)
        .eq("session_id", sessionId);

      if (error) throw error;
    }

    // Satu baris riwayat per jawaban siswa.
    const attemptRows = graded.map((item) => ({
      user_id: user.id,
      question_id: null,
      learning_path_id: session.learning_path_id,
      answer: item.submitted.answer,
      is_correct: item.isCorrect,
      response_time_ms: item.submitted.response_time_ms ?? null,
      session_id: sessionId,
      session_question_id: item.question.id,
      attempted_at: now,
    }));

    const { error: attemptsError } = await admin
      .from("quiz_attempts")
      .insert(attemptRows);

    if (attemptsError) throw attemptsError;

    const { error: sessionUpdateError } = await admin
      .from("quiz_sessions")
      .update({
        correct_count: correctCount,
        score,
        status: passed ? "passed" : "failed",
        submitted_at: now,
        completed_at: now,
        updated_at: now,
      })
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .eq("status", "in_progress");

    if (sessionUpdateError) throw sessionUpdateError;

    const { data: checkpoint, error: checkpointError } = await admin
      .from("learning_path_checkpoints")
      .select("*")
      .eq("user_id", user.id)
      .eq("learning_path_id", session.learning_path_id)
      .eq("checkpoint_number", session.checkpoint_number)
      .maybeSingle();

    if (checkpointError) throw checkpointError;
    if (!checkpoint) {
      throw new Error("Data learning path checkpoint tidak ditemukan.");
    }

    const oldBest = Number(checkpoint.best_score ?? 0);
    const bestScore = Math.max(oldBest, score);
    const checkpointPassed = Boolean(checkpoint.passed_at) || passed;

    const { error: checkpointUpdateError } = await admin
      .from("learning_path_checkpoints")
      .update({
        best_score: bestScore,
        ...(checkpointPassed
          ? {
              passed_at: checkpoint.passed_at ?? now,
              unlocked_at: checkpoint.unlocked_at ?? now,
            }
          : {}),
        updated_at: now,
      })
      .eq("id", checkpoint.id)
      .eq("user_id", user.id);

    if (checkpointUpdateError) throw checkpointUpdateError;

    // Jika lulus, buka tahap setelah rentang checkpoint ini.
    if (passed) {
      const { data: nextSteps, error: nextStepsError } = await admin
        .from("learning_path_steps")
        .select("id")
        .eq("learning_path_id", session.learning_path_id)
        .eq("order_sequence", session.end_order_sequence + 1);

      if (nextStepsError) throw nextStepsError;

      if (nextSteps?.length) {
        const nextStepIds = nextSteps.map((step) => step.id);

        const { error: unlockError } = await admin
          .from("learning_path_steps")
          .update({ status: "available" })
          .in("id", nextStepIds)
          .eq("status", "locked");

        if (unlockError) throw unlockError;

        const { error: progressError } = await admin
          .from("step_progress")
          .upsert(
            nextStepIds.map((stepId) => ({
              user_id: user.id,
              step_id: stepId,
              status: "not_started",
              progress_percent: 0,
            })),
            { onConflict: "user_id,step_id", ignoreDuplicates: true },
          );

        if (progressError) throw progressError;
      }

      // Buka checkpoint berikutnya jika sudah dibuat sebelumnya.
      const { error: nextCheckpointError } = await admin
        .from("learning_path_checkpoints")
        .update({
          unlocked_at: now,
          updated_at: now,
        })
        .eq("user_id", user.id)
        .eq("learning_path_id", session.learning_path_id)
        .eq("checkpoint_number", session.checkpoint_number + 1)
        .is("unlocked_at", null);

      if (nextCheckpointError) throw nextCheckpointError;
    }

    // Pembahasan dikirim setelah jawaban dikumpulkan.
    const review = graded.map((item) => ({
      session_question_id: item.question.id,
      question_order: item.question.question_order,
      is_correct: item.isCorrect,
      correct_answer:
        typeof item.key.correct_answer === "string"
          ? item.key.correct_answer
          : String(item.key.correct_answer),
      explanation: item.key.explanation,
    }));

    return json({
      session_id: sessionId,
      checkpoint_number: session.checkpoint_number,
      total_questions: questions.length,
      correct_count: correctCount,
      score,
      passing_score: Number(session.passing_score ?? 70),
      passed,
      status: passed ? "passed" : "failed",
      review,
    });
  } catch (error) {
    console.error("submit-checkpoint-quiz:", error);

    return json({
      error: error instanceof Error
        ? error.message
        : "Gagal memeriksa jawaban checkpoint.",
    }, 500);
  }
});
