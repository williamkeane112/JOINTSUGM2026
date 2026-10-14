
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const getEnv = (name: string) => Deno.env.get(name);

const GEMINI_API_KEY = getEnv("GEMINI_API_KEY");
const SUPABASE_URL = getEnv("SUPABASE_URL");
const SUPABASE_PUBLISHABLE_KEY =
  getEnv("SUPABASE_PUBLISHABLE_KEY") ??
  getEnv("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = getEnv("SUPABASE_SERVICE_ROLE_KEY");

type QuizQuestion = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  skill_key: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
};

function validateQuestions(value: unknown): value is QuizQuestion[] {
  if (!Array.isArray(value) || value.length !== 10) return false;

  return value.every((q) =>
    q &&
    typeof q.id === "string" &&
    typeof q.question === "string" &&
    typeof q.skill_key === "string" &&
    ["beginner", "intermediate", "advanced"].includes(
      q.difficulty_level,
    ) &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    q.options.every((o: any) =>
      o &&
      ["A", "B", "C", "D"].includes(o.id) &&
      typeof o.text === "string"
    )
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  if (
    !SUPABASE_URL ||
    !SUPABASE_PUBLISHABLE_KEY ||
    !SUPABASE_SERVICE_ROLE_KEY ||
    !GEMINI_API_KEY
  ) {
    return jsonResponse({
      error: "Konfigurasi Edge Function belum lengkap.",
    }, 500);
  }

  try {
    // Autentikasi pengguna berdasarkan access token.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Token autentikasi tidak ditemukan." }, 401);
    }

    const userClient = createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        global: { headers: { Authorization: authHeader } },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const token = authHeader.slice("Bearer ".length);
    const { data: authData, error: authError } =
      await userClient.auth.getUser(token);

    if (authError || !authData.user) {
      return jsonResponse({ error: "Sesi tidak valid atau sudah berakhir." }, 401);
    }

    const user = authData.user;

    // Klien admin hanya digunakan di backend.
    const admin = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const body = await req.json();
    const action = body.action;
    const learningGoalId = body.learning_goal_id;

    if (action === "generate") {
      if (
        typeof learningGoalId !== "string" ||
        !/^[0-9a-f-]{36}$/i.test(learningGoalId)
      ) {
        return jsonResponse({ error: "learning_goal_id tidak valid." }, 400);
      }

      // Pastikan goal memang milik pengguna yang sedang login.
      const { data: goal, error: goalError } = await admin
        .from("learning_goals")
        .select(
          "id, user_id, topic_id, requested_topic, description, target_outcome, target_level",
        )
        .eq("id", learningGoalId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (goalError) throw goalError;
      if (!goal) {
        return jsonResponse({ error: "Learning goal tidak ditemukan." }, 404);
      }

      // Jika goal berasal dari katalog, gunakan nama topik katalog.
      let topicName = goal.requested_topic;

      if (goal.topic_id !== null) {
        const { data: topic, error: topicError } = await admin
          .from("topics")
          .select("name")
          .eq("id", goal.topic_id)
          .maybeSingle();

        if (topicError) throw topicError;
        if (topic?.name) topicName = topic.name;
      }

      // Gunakan sesi diagnostic yang masih berlangsung jika tersedia.
      const { data: existing, error: existingError } = await admin
        .from("diagnostic_assessments")
        .select("id, questions, answers, total_questions, status, created_at")
        .eq("user_id", user.id)
        .eq("learning_goal_id", learningGoalId)
        .eq("status", "in_progress")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingError) throw existingError;

      if (existing) {
        return jsonResponse({
          assessment: existing,
          resumed: true,
        });
      }

      const prompt = `
Kamu adalah pembuat tes diagnostik untuk aplikasi pendidikan SkillPath AI.

Buat tepat 10 soal pilihan ganda untuk mengukur kemampuan awal siswa.

Topik: ${topicName}
Target hasil belajar: ${goal.target_outcome ?? "Memahami topik dengan baik"}
Level target: ${goal.target_level}
Deskripsi tambahan: ${goal.description ?? "-"}

Ketentuan:
- Gunakan bahasa Indonesia yang jelas.
- Sesuaikan soal dengan topik dan tujuan belajar.
- Uji pemahaman konsep dan penerapan, bukan sekadar hafalan.
- Variasikan kesulitan sesuai level target.
- Setiap soal memiliki tepat 4 pilihan yang masuk akal.
- Tepat satu pilihan benar untuk setiap soal.
- Gunakan ID pilihan A, B, C, D.
- skill_key harus singkat dan konsisten untuk kemampuan yang diuji.
- Jangan membuat pertanyaan yang tidak relevan dengan topik.

Kembalikan JSON dengan struktur persis:
{
  "questions": [
    {
      "id": "q1",
      "question": "Teks pertanyaan",
      "options": [
        {"id": "A", "text": "Pilihan A"},
        {"id": "B", "text": "Pilihan B"},
        {"id": "C", "text": "Pilihan C"},
        {"id": "D", "text": "Pilihan D"}
      ],
      "correct_answer": "A",
      "explanation": "Penjelasan singkat jawaban benar",
      "skill_key": "nama_kemampuan",
      "difficulty_level": "beginner"
    }
  ]
}
`;


      const geminiResponse = await fetch(
       "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.4,
            },
          }),
        },
      );

      if (!geminiResponse.ok) {
        const details = await geminiResponse.text();
        console.error("Gemini API error:", details);
        return jsonResponse({
          error: "Gemini gagal membuat soal. Periksa API key dan kuota.",
        }, 502);
      }

      const geminiData = await geminiResponse.json();
      const generatedText =
        geminiData.candidates?.[0]?.content?.parts
          ?.map((part: { text?: string }) => part.text ?? "")
          .join("") ?? "";

      let parsed: any;
      try {
        parsed = JSON.parse(generatedText);
      } catch {
        return jsonResponse({
          error: "Gemini mengembalikan format soal yang tidak valid.",
        }, 502);
      }

      if (!validateQuestions(parsed.questions)) {
        return jsonResponse({
          error: "Struktur soal dari Gemini tidak sesuai.",
        }, 502);
      }

      const ids = parsed.questions.map((q: QuizQuestion) => q.id);
      if (new Set(ids).size !== 10) {
        return jsonResponse({ error: "ID soal harus unik." }, 502);
      }

      // Jawaban dan penjelasan hanya disimpan di tabel privat.
      const answerKey: Record<string, string> = {};
      const explanations: Record<string, string> = {};

      for (const q of parsed.questions as any[]) {
        if (!["A", "B", "C", "D"].includes(q.correct_answer)) {
          return jsonResponse({
            error: "Kunci jawaban dari Gemini tidak valid.",
          }, 502);
        }

        answerKey[q.id] = q.correct_answer;
        explanations[q.id] = String(q.explanation ?? "");
      }

      // Jangan kirim kunci atau penjelasan ke browser.
      const publicQuestions = (parsed.questions as any[]).map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        skill_key: q.skill_key,
        difficulty_level: q.difficulty_level,
      }));

      const { data: assessment, error: insertError } = await admin
        .from("diagnostic_assessments")
        .insert({
          user_id: user.id,
          learning_goal_id: learningGoalId,
          questions: publicQuestions,
          answers: {},
          score: null,
          total_questions: 10,
          skill_analysis: null,
          status: "in_progress",
        })
        .select("id, questions, answers, total_questions, status, created_at")
        .single();

      if (insertError) throw insertError;

      const { error: keyError } = await admin
        .from("diagnostic_answer_keys")
        .insert({
          assessment_id: assessment.id,
          answer_key: answerKey,
          explanations,
        });

      if (keyError) {
        // Jangan tinggalkan assessment tanpa kunci jawaban.
        await admin
          .from("diagnostic_assessments")
          .delete()
          .eq("id", assessment.id);

        throw keyError;
      }

      return jsonResponse({ assessment, resumed: false });
    }

    if (action === "submit") {
      const assessmentId = body.assessment_id;
      const submittedAnswers = body.answers;

      if (
        typeof assessmentId !== "string" ||
        !/^[0-9a-f-]{36}$/i.test(assessmentId) ||
        !submittedAnswers ||
        typeof submittedAnswers !== "object" ||
        Array.isArray(submittedAnswers)
      ) {
        return jsonResponse({
          error: "assessment_id atau answers tidak valid.",
        }, 400);
      }

      const { data: assessment, error: assessmentError } = await admin
        .from("diagnostic_assessments")
        .select("id, user_id, questions, total_questions, status")
        .eq("id", assessmentId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (assessmentError) throw assessmentError;
      if (!assessment) {
        return jsonResponse({ error: "Assessment tidak ditemukan." }, 404);
      }

      if (assessment.status === "completed") {
        return jsonResponse({
          error: "Diagnostic ini sudah diselesaikan.",
        }, 409);
      }

      const questions = assessment.questions as QuizQuestion[];
      const validIds = new Set(questions.map((q) => q.id));

      // Tolak jawaban untuk soal yang tidak ada.
      for (const [questionId, answer] of Object.entries(submittedAnswers)) {
        if (!validIds.has(questionId) || typeof answer !== "string" ||
          !["A", "B", "C", "D"].includes(answer)) {
          return jsonResponse({ error: "Format jawaban tidak valid." }, 400);
        }
      }

      const { data: keyRow, error: keyError } = await admin
        .from("diagnostic_answer_keys")
        .select("answer_key, explanations")
        .eq("assessment_id", assessmentId)
        .maybeSingle();

      if (keyError) throw keyError;
      if (!keyRow) {
        return jsonResponse({ error: "Kunci jawaban tidak ditemukan." }, 500);
      }

      const answerKey = keyRow.answer_key as Record<string, string>;
      const explanations = keyRow.explanations as Record<string, string>;

      let score = 0;
      const skillStats: Record<string, {
        correct: number;
        total: number;
      }> = {};

      for (const q of questions) {
        const skill = q.skill_key || "umum";
        if (!skillStats[skill]) {
          skillStats[skill] = { correct: 0, total: 0 };
        }

        skillStats[skill].total++;

        if (submittedAnswers[q.id] === answerKey[q.id]) {
          score++;
          skillStats[skill].correct++;
        }
      }

      const analysis = Object.entries(skillStats).map(([skill, stats]) => ({
        skill_key: skill,
        correct: stats.correct,
        total: stats.total,
        percentage: Math.round((stats.correct / stats.total) * 100),
        level:
          stats.correct / stats.total >= 0.8
            ? "strong"
            : stats.correct / stats.total >= 0.5
            ? "developing"
            : "needs_improvement",
      }));

      const { data: updated, error: updateError } = await admin
        .from("diagnostic_assessments")
        .update({
          answers: submittedAnswers,
          score,
          skill_analysis: analysis,
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", assessmentId)
        .eq("user_id", user.id)
        .eq("status", "in_progress")
        .select("id, score, total_questions, skill_analysis, status, completed_at")
        .maybeSingle();

      if (updateError) throw updateError;
      if (!updated) {
        return jsonResponse({
          error: "Assessment sudah diproses atau tidak dapat diperbarui.",
        }, 409);
      }

      return jsonResponse({
        result: {
          ...updated,
          percentage: Math.round(
            (score / updated.total_questions) * 100,
          ),
          explanations,
          correct_answers: answerKey,
        },
      });
    }

    return jsonResponse({
      error: 'Action tidak valid. Gunakan "generate" atau "submit".',
    }, 400);
  } catch (error) {
    console.error("diagnostic-quiz error:", error);
    return jsonResponse({
      error: "Terjadi kesalahan pada server saat memproses diagnostic quiz.",
    }, 500);
  }
});
