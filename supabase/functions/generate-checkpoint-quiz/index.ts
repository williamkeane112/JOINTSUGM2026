
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
const SHITERU_API_KEY = Deno.env.get("SHITERU_API_KEY") ?? "";
const SHITERU_MODEL = Deno.env.get("SHITERU_MODEL") ?? "gpt-6-astra";
const SHITERU_BASE_URL = (
  Deno.env.get("SHITERU_BASE_URL") ?? "https://ai.shiteru.id/v1"
).replace(/\/+$/, "");

type Option = { id: "A" | "B" | "C" | "D"; text: string };
type GeneratedQuestion = {
  question: string;
  options: Option[];
  correct_answer: "A" | "B" | "C" | "D";
  explanation: string;
  skill_key: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
};

function parseJson(text: string): unknown {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("Respons AI bukan JSON yang valid.");
  }
}

function validateQuestions(value: unknown): value is {
  questions: GeneratedQuestion[];
} {
  if (!value || typeof value !== "object") return false;

  const questions = (value as { questions?: unknown }).questions;
  if (!Array.isArray(questions) || questions.length !== 10) return false;

  const ids = ["A", "B", "C", "D"];

  return questions.every((q) => {
    if (!q || typeof q !== "object") return false;
    const item = q as Record<string, unknown>;

    if (typeof item.question !== "string" || !item.question.trim()) {
      return false;
    }

    if (
      !Array.isArray(item.options) ||
      item.options.length !== 4 ||
      !item.options.every(
        (o) =>
          o &&
          typeof o === "object" &&
          ids.includes(String((o as Record<string, unknown>).id)) &&
          typeof (o as Record<string, unknown>).text === "string" &&
          String((o as Record<string, unknown>).text).trim(),
      )
    ) {
      return false;
    }

    const optionIds = item.options.map(
      (o) => (o as Record<string, unknown>).id,
    );

    return (
      new Set(optionIds).size === 4 &&
      ids.every((id) => optionIds.includes(id)) &&
      ids.includes(String(item.correct_answer)) &&
      typeof item.explanation === "string" &&
      Boolean(item.explanation.trim()) &&
      typeof item.skill_key === "string" &&
      Boolean(item.skill_key.trim()) &&
      ["beginner", "intermediate", "advanced"].includes(
        String(item.difficulty_level),
      )
    );
  });
}

async function generateQuestions(
  checkpointNumber: number,
  steps: Array<Record<string, unknown>>,
): Promise<GeneratedQuestion[]> {
  const learningContext = steps.map((step) => {
    const material = step.material as Record<string, unknown> | null;

    return {
      stage: step.order_sequence,
      title: step.title,
      description: step.description,
      learning_objectives: step.learning_objectives,
      material_title: material?.title ?? null,
      material_content: material?.content ?? null,
      material_description: material?.description ?? null,
    };
  });

  const systemPrompt = `
Kamu adalah pembuat soal evaluasi pembelajaran SkillPath AI.
Buat tepat 10 soal pilihan ganda berdasarkan konteks belajar yang diberikan.
Gunakan bahasa Indonesia yang jelas.
Uji pemahaman, penerapan, analisis sederhana, dan pemecahan masalah.
Jangan mengulang pertanyaan dengan hanya mengganti kata.
Sesuaikan tingkat kesulitan dengan materi dan tujuan belajar.
Setiap soal memiliki tepat empat opsi dengan ID A, B, C, D.
Satu jawaban benar saja.
Jangan membuat pertanyaan di luar materi.
Jangan memasukkan kunci jawaban ke dalam teks soal atau opsi.
Keluarkan JSON valid saja tanpa markdown.

Format:
{
  "questions": [
    {
      "question": "Teks soal",
      "options": [
        {"id":"A","text":"Opsi A"},
        {"id":"B","text":"Opsi B"},
        {"id":"C","text":"Opsi C"},
        {"id":"D","text":"Opsi D"}
      ],
      "correct_answer": "A",
      "explanation": "Penjelasan jawaban",
      "skill_key": "javascript_variables",
      "difficulty_level": "beginner"
    }
  ]
}
`.trim();

  const userPrompt = `
Buat checkpoint nomor ${checkpointNumber}.

Konteks tahap belajar yang telah diselesaikan:
${JSON.stringify(learningContext)}

Ketentuan tambahan:
- Buat tepat 10 soal yang mencakup beberapa tahap tersebut.
- Variasikan bentuk pertanyaan dan posisi jawaban benar.
- Hindari soal yang bisa dijawab hanya dengan menghafal kalimat.
- skill_key harus stabil, singkat, menggunakan snake_case.
- difficulty_level hanya beginner, intermediate, atau advanced.
`.trim();

  const response = await fetch(`${SHITERU_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SHITERU_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: SHITERU_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.85,
      max_tokens: 6000,
    }),
    signal: AbortSignal.timeout(100_000),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Shiteru error:", response.status, detail);
    throw new Error(`Layanan AI gagal menghasilkan soal (${response.status}).`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error("Respons Shiteru tidak berisi konten.");
  }

  const parsed = parseJson(content);

  if (!validateQuestions(parsed)) {
    throw new Error("Format soal AI tidak valid atau jumlah soal bukan 10.");
  }

  return parsed.questions;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method tidak diizinkan." }, 405);
  }

  if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY || !SHITERU_API_KEY) {
    return json(
      { error: "Konfigurasi Supabase atau Shiteru belum lengkap." },
      500,
    );
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

  let sessionId: string | null = null;

  try {
    const { data: authData, error: authError } =
      await userClient.auth.getUser();

    if (authError || !authData.user) {
      return json({ error: "Sesi login tidak valid." }, 401);
    }

    const user = authData.user;
    const body = await req.json();

    const learningPathId =
      typeof body.learning_path_id === "string"
        ? body.learning_path_id.trim()
        : "";
    const checkpointNumber = Number(body.checkpoint_number);

    if (
      !learningPathId ||
      !Number.isInteger(checkpointNumber) ||
      checkpointNumber < 1
    ) {
      return json({
        error: "learning_path_id dan checkpoint_number wajib valid.",
      }, 400);
    }

    // Pastikan learning path milik siswa yang sedang login.
    const { data: path, error: pathError } = await admin
      .from("learning_paths")
      .select("id, user_id, title, status")
      .eq("id", learningPathId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (pathError) throw pathError;
    if (!path) {
      return json({ error: "Learning path tidak ditemukan." }, 404);
    }

    const { data: checkpoint, error: checkpointError } = await admin
      .from("learning_path_checkpoints")
      .select("*")
      .eq("user_id", user.id)
      .eq("learning_path_id", learningPathId)
      .eq("checkpoint_number", checkpointNumber)
      .maybeSingle();

    if (checkpointError) throw checkpointError;
    if (!checkpoint) {
      return json({
        error: "Checkpoint belum tersedia untuk learning path ini.",
      }, 404);
    }

    // Checkpoint sebelumnya harus sudah lulus.
    if (checkpointNumber > 1) {
      const { data: previous, error: previousError } = await admin
        .from("learning_path_checkpoints")
        .select("passed_at")
        .eq("user_id", user.id)
        .eq("learning_path_id", learningPathId)
        .eq("checkpoint_number", checkpointNumber - 1)
        .maybeSingle();

      if (previousError) throw previousError;

      if (!previous?.passed_at) {
        return json({
          error: "Selesaikan checkpoint sebelumnya terlebih dahulu.",
        }, 403);
      }
    }

    // Periksa bahwa semua tahap dalam rentang checkpoint telah selesai.
    const { data: steps, error: stepsError } = await admin
      .from("learning_path_steps")
      .select(
        "id, title, description, learning_objectives, order_sequence, material_id, status",
      )
      .eq("learning_path_id", learningPathId)
      .gte("order_sequence", checkpoint.start_order_sequence)
      .lte("order_sequence", checkpoint.end_order_sequence)
      .order("order_sequence", { ascending: true });

    if (stepsError) throw stepsError;

    if (!steps?.length) {
      return json({ error: "Tahap untuk checkpoint ini tidak ditemukan." }, 400);
    }

    const { data: progressRows, error: progressError } = await admin
      .from("step_progress")
      .select("step_id, status, progress_percent")
      .eq("user_id", user.id)
      .in("step_id", steps.map((step) => step.id));

    if (progressError) throw progressError;

    const completed = new Set(
      (progressRows ?? [])
        .filter(
          (p) => p.status === "completed" || p.progress_percent === 100,
        )
        .map((p) => p.step_id),
    );

    const incomplete = steps.filter(
      (step) => !completed.has(step.id) && step.status !== "completed",
    );

    if (incomplete.length > 0) {
      return json({
        error: "Selesaikan semua tahap pada checkpoint ini terlebih dahulu.",
        incomplete_steps: incomplete.map((step) => ({
          id: step.id,
          title: step.title,
          order_sequence: step.order_sequence,
        })),
      }, 403);
    }

    // Ambil isi materi sebagai dasar pembuatan soal.
    const materialIds = [
      ...new Set(
        steps
          .map((step) => step.material_id)
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    const materialMap = new Map<string, Record<string, unknown>>();

    if (materialIds.length) {
      const { data: materials, error: materialsError } = await admin
        .from("materials")
        .select("id, title, description, content")
        .in("id", materialIds);

      if (materialsError) throw materialsError;

      for (const material of materials ?? []) {
        materialMap.set(material.id, material);
      }
    }

    const stepsWithMaterials = steps.map((step) => ({
      ...step,
      material: step.material_id
        ? materialMap.get(step.material_id) ?? null
        : null,
    })) as Array<Record<string, unknown>>;

    // Jika sesi aktif sebelumnya ada, kembalikan soal yang sama agar
    // refresh halaman tidak membuat sesi baru atau mengulang biaya AI.
    const { data: existingSessions, error: existingError } = await admin
      .from("quiz_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("learning_path_id", learningPathId)
      .eq("checkpoint_number", checkpointNumber)
      .in("status", ["generating", "in_progress"])
      .order("attempt_number", { ascending: false })
      .limit(1);

    if (existingError) throw existingError;

    const existing = existingSessions?.[0];

    if (existing?.status === "in_progress") {
      const { data: questions, error: questionsError } = await admin
        .from("quiz_session_questions")
        .select(
          "id, question_order, question_text, question_type, options, skill_key, difficulty_level",
        )
        .eq("session_id", existing.id)
        .order("question_order", { ascending: true });

      if (questionsError) throw questionsError;

      if (questions?.length === 10) {
        return json({
          session_id: existing.id,
          checkpoint_number: checkpointNumber,
          question_count: 10,
          passing_score: existing.passing_score,
          questions,
          resumed: true,
        });
      }
    }

    // Tentukan nomor percobaan berikutnya.
    const { data: lastSession, error: lastError } = await admin
      .from("quiz_sessions")
      .select("attempt_number")
      .eq("user_id", user.id)
      .eq("learning_path_id", learningPathId)
      .eq("checkpoint_number", checkpointNumber)
      .order("attempt_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastError) throw lastError;

    const attemptNumber = (lastSession?.attempt_number ?? 0) + 1;

    const { data: newSession, error: createError } = await admin
      .from("quiz_sessions")
      .insert({
        user_id: user.id,
        learning_path_id: learningPathId,
        checkpoint_number: checkpointNumber,
        start_order_sequence: checkpoint.start_order_sequence,
        end_order_sequence: checkpoint.end_order_sequence,
        attempt_number: attemptNumber,
        question_count: 10,
        passing_score: checkpoint.passing_score ?? 70,
        status: "generating",
      })
      .select("*")
      .single();

    if (createError) throw createError;
    sessionId = newSession.id;

    const questions = await generateQuestions(
      checkpointNumber,
      stepsWithMaterials,
    );

    const { data: insertedQuestions, error: insertQuestionsError } =
      await admin
        .from("quiz_session_questions")
        .insert(
          questions.map((q, index) => ({
            session_id: newSession.id,
            question_id: null,
            question_order: index + 1,
            question_text: q.question,
            question_type: "multiple_choice",
            options: q.options,
            skill_key: q.skill_key,
            difficulty_level: q.difficulty_level,
          })),
        )
        .select(
          "id, question_order, question_text, question_type, options, skill_key, difficulty_level",
        );

    if (insertQuestionsError) throw insertQuestionsError;

    if (!insertedQuestions || insertedQuestions.length !== 10) {
      throw new Error("Tidak semua soal berhasil disimpan.");
    }

    const answerKeyRows = insertedQuestions.map((question) => {
      const generated = questions[question.question_order - 1];

      return {
        session_question_id: question.id,
        correct_answer: generated.correct_answer,
        explanation: generated.explanation,
      };
    });

    const { error: keysError } = await admin
      .from("quiz_session_answer_keys")
      .insert(answerKeyRows);

    if (keysError) throw keysError;

    const { error: updateSessionError } = await admin
      .from("quiz_sessions")
      .update({
        status: "in_progress",
        updated_at: new Date().toISOString(),
      })
      .eq("id", newSession.id);

    if (updateSessionError) throw updateSessionError;

    return json({
      session_id: newSession.id,
      checkpoint_number: checkpointNumber,
      attempt_number: attemptNumber,
      question_count: 10,
      passing_score: newSession.passing_score,
      questions: insertedQuestions,
    });
  } catch (error) {
    console.error("generate-checkpoint-quiz:", error);

    if (sessionId) {
      await admin
        .from("quiz_sessions")
        .update({
          status: "error",
          generation_error: error instanceof Error
            ? error.message.slice(0, 1000)
            : "Gagal membuat soal.",
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }

    return json({
      error: error instanceof Error
        ? error.message
        : "Gagal membuat checkpoint.",
    }, 500);
  }
});
