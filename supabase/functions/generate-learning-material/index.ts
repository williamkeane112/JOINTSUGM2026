import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY =
  Deno.env.get("SUPABASE_ANON_KEY") ??
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SHITERU_API_KEY = Deno.env.get("SHITERU_API_KEY");
const SHITERU_MODEL = Deno.env.get("SHITERU_MODEL") ?? "gpt-6-astra";
const SHITERU_BASE_URL = (
  Deno.env.get("SHITERU_BASE_URL") ?? "https://ai.shiteru.id/v1"
).replace(/\/+$/, "");

// Keep this shorter than the previous 85-second request because the Edge
// Function itself may be terminated by the platform before that timeout.
const AI_TIMEOUT_MS = 110_000;

type LessonSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  example?: string;
};

type Lesson = {
  title: string;
  summary: string;
  learning_objectives: string[];
  sections: LessonSection[];
  practice: {
    title: string;
    instructions: string[];
    expected_result: string;
  };
  safety_note?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(
  value: unknown,
  minLength = 0,
): value is string[] {
  return Array.isArray(value) &&
    value.length >= minLength &&
    value.every((item) => typeof item === "string");
}

function validLesson(value: unknown): value is Lesson {
  if (!isRecord(value)) return false;
  if (typeof value.title !== "string" || !value.title.trim()) return false;
  if (typeof value.summary !== "string" || !value.summary.trim()) return false;
  if (!isStringArray(value.learning_objectives, 1)) return false;
  if (!Array.isArray(value.sections) || value.sections.length < 2) {
    return false;
  }

  const validSections = value.sections.every((section) => {
    if (!isRecord(section)) return false;
    if (typeof section.title !== "string" || !section.title.trim()) {
      return false;
    }
    if (!isStringArray(section.paragraphs, 1)) return false;
    if (
      section.bullets !== undefined &&
      !isStringArray(section.bullets)
    ) return false;
    if (
      section.example !== undefined &&
      typeof section.example !== "string"
    ) return false;
    return true;
  });

  if (!validSections) return false;
  if (!isRecord(value.practice)) return false;
  if (
    typeof value.practice.title !== "string" ||
    !value.practice.title.trim()
  ) return false;
  if (!isStringArray(value.practice.instructions, 1)) return false;
  if (typeof value.practice.expected_result !== "string") return false;
  if (
    value.safety_note !== undefined &&
    typeof value.safety_note !== "string"
  ) return false;

  return true;
}

function parseJson(text: string): unknown {
  let cleaned = text.trim();
  cleaned = cleaned
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    }
    throw new Error("Respons AI bukan JSON yang valid.");
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error ?? "Unknown error");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method tidak diizinkan." }, 405);
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase environment variables belum lengkap.");
    return jsonResponse(
      { error: "Konfigurasi Supabase Edge Function belum lengkap." },
      500,
    );
  }
  if (!SHITERU_API_KEY) {
    return jsonResponse({
      error: "Secret SHITERU_API_KEY belum dikonfigurasi pada Supabase Edge Functions.",
    }, 500);
  }

  const authorization = req.headers.get("Authorization");
  if (!authorization) {
    return jsonResponse({
      error: "Sesi login tidak ditemukan. Silakan login kembali.",
    }, 401);
  }

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let userId: string | null = null;

  try {
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) {
      return jsonResponse({
        error: "Sesi login tidak valid. Silakan login ulang.",
      }, 401);
    }

    const user = userData.user;
    userId = user.id;

    const body = await req.json().catch(() => ({}));
    const stepId = typeof body?.step_id === "string"
      ? body.step_id.trim()
      : "";
    if (!stepId) {
      return jsonResponse({ error: "step_id wajib diisi." }, 400);
    }

    const { data: step, error: stepError } = await admin
      .from("learning_path_steps")
      .select(
        "id, learning_path_id, material_id, title, description, learning_objectives, order_sequence, estimated_minutes, status",
      )
      .eq("id", stepId)
      .maybeSingle();

    if (stepError) {
      throw new Error(`Gagal mengambil tahap: ${stepError.message}`);
    }
    if (!step) return jsonResponse({ error: "Tahap tidak ditemukan." }, 404);

    const { data: path, error: pathError } = await admin
      .from("learning_paths")
      .select("id, user_id, title, description, difficulty_level, goal_id")
      .eq("id", step.learning_path_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (pathError) {
      throw new Error(`Gagal mengambil learning path: ${pathError.message}`);
    }
    if (!path) {
      return jsonResponse({
        error: "Kamu tidak memiliki akses ke learning path ini.",
      }, 403);
    }

    // Reuse the saved material if it has the new material-only schema.
    if (step.material_id) {
      const { data: cached, error: cachedError } = await admin
        .from("materials")
        .select("id, title, description, content")
        .eq("id", step.material_id)
        .maybeSingle();

      if (cachedError) {
        throw new Error(`Gagal mengambil cache materi: ${cachedError.message}`);
      }

      if (cached?.content !== null && cached?.content !== undefined) {
        try {
          const cachedLesson = typeof cached.content === "string"
            ? parseJson(cached.content)
            : cached.content;

          if (validLesson(cachedLesson)) {
            return jsonResponse({
              lesson: cachedLesson,
              material_id: cached.id,
              cached: true,
            });
          }
          console.warn(
            "Cache materi memiliki struktur tidak valid; akan dibuat ulang.",
            cached.id,
          );
        } catch (error) {
          console.warn(
            "Cache materi tidak dapat diparsing; akan dibuat ulang.",
            errorMessage(error),
          );
        }
      }
    }

    const { data: priorSteps, error: priorStepsError } = await admin
      .from("learning_path_steps")
      .select("title, status, order_sequence")
      .eq("learning_path_id", path.id)
      .lt("order_sequence", step.order_sequence)
      .order("order_sequence", { ascending: true });

    if (priorStepsError) {
      throw new Error(
        `Gagal mengambil tahap sebelumnya: ${priorStepsError.message}`,
      );
    }

    const unfinishedPrerequisite = (priorSteps ?? []).find(
      (item) => item.status !== "completed",
    );
    if (unfinishedPrerequisite) {
      return jsonResponse({
        error: `Selesaikan tahap sebelumnya terlebih dahulu: ${unfinishedPrerequisite.title}`,
      }, 409);
    }

    let goal: Record<string, unknown> | null = null;
    if (path.goal_id) {
      const { data: goalData, error: goalError } = await admin
        .from("learning_goals")
        .select("requested_topic, description, target_level, target_outcome")
        .eq("id", path.goal_id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (goalError) {
        throw new Error(`Gagal mengambil tujuan belajar: ${goalError.message}`);
      }
      goal = goalData;
    }

    const { data: mastery, error: masteryError } = await admin
      .from("student_mastery")
      .select("skill_key, p_known, attempts")
      .eq("user_id", user.id)
      .limit(30);

    if (masteryError) {
      console.warn(
        "Data mastery tidak tersedia; lanjut tanpa personalisasi mastery.",
        masteryError.message,
      );
    }

    const topic = String(goal?.requested_topic ?? path.title ?? step.title);
    const targetLevel = String(
      goal?.target_level ?? path.difficulty_level ?? "beginner",
    );
    const duration = Math.max(1, Number(step.estimated_minutes) || 30);

    // Deliberately do not ask the model to generate quiz questions here.
    // Quiz generation will be handled by a separate Edge Function.
    const prompt = `
Kamu adalah tutor AI SkillPath AI yang membuat SATU materi pembelajaran.
Tulis dalam bahasa Indonesia yang jelas, akurat, konkret, runtut, dan cocok
untuk siswa. Buat materi yang dapat dipelajari mandiri. Jangan membuat soal
kuis, pilihan ganda, kunci jawaban, atau penilaian apa pun.

KONTEKS:
Topik tujuan: ${topic}
Deskripsi tujuan: ${String(goal?.description ?? path.description ?? "-")}
Target hasil: ${String(goal?.target_outcome ?? "Memahami materi dan dapat mempraktikkannya")}
Level: ${targetLevel}
Learning path: ${path.title}
Deskripsi path: ${String(path.description ?? "-")}
Tahap ke-${step.order_sequence}: ${step.title}
Deskripsi tahap: ${String(step.description ?? "-")}
Target tahap (JSON): ${JSON.stringify(step.learning_objectives ?? [])}
Durasi belajar: ${duration} menit
Tahap sebelumnya: ${JSON.stringify(priorSteps ?? [])}
Data penguasaan skill (bila tersedia): ${JSON.stringify(mastery ?? [])}

ATURAN MATERI:
- Fokus hanya pada tahap ini, jangan menulis ulang seluruh learning path.
- Buat 3-4 bagian dengan penjelasan yang cukup untuk dipelajari, bukan hanya ringkasan.
- Setiap bagian wajib memiliki title dan paragraphs berupa array string tidak kosong.
- Sertakan contoh konkret yang relevan setidaknya pada satu bagian.
- Gunakan bullets jika membantu menjelaskan poin penting.
- Sertakan latihan praktik dengan title, instructions (array string), dan expected_result.
- Hindari placeholder dan kalimat seperti "tambahkan sendiri".
- Sesuaikan istilah dan kedalaman materi dengan level siswa.
- Jika topik terkait keamanan siber, batasi praktik ke lab lokal atau sistem yang secara eksplisit diizinkan.
- Keluarkan JSON valid saja, tanpa markdown fence atau teks di luar JSON.

STRUKTUR JSON:
{
  "title": "Judul materi",
  "summary": "Ringkasan singkat",
  "learning_objectives": ["Tujuan 1"],
  "sections": [
    {
      "title": "Subjudul",
      "paragraphs": ["Paragraf penjelasan"],
      "bullets": ["Poin penting"],
      "example": "Contoh konkret"
    }
  ],
  "practice": {
    "title": "Judul latihan",
    "instructions": ["Langkah 1", "Langkah 2"],
    "expected_result": "Hasil yang diharapkan"
  },
  "safety_note": "Catatan keselamatan jika relevan"
}
`;

    const aiStartedAt = Date.now();
    console.info("Shiteru material generation started", {
      model: SHITERU_MODEL,
      timeout_ms: AI_TIMEOUT_MS,
      step_id: step.id,
    });

    const aiResponse = await fetch(`${SHITERU_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SHITERU_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: SHITERU_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah tutor SkillPath AI. Keluarkan hanya JSON valid sesuai schema materi. Jangan menghasilkan kuis.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.35,
        // Keep the generated JSON bounded to reduce response latency.
        max_tokens: 2200,
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(AI_TIMEOUT_MS),
    });

    console.info("Shiteru material generation response received", {
      elapsed_ms: Date.now() - aiStartedAt,
      status: aiResponse.status,
    });

    if (!aiResponse.ok) {
      const details = (await aiResponse.text()).slice(0, 1200);
      console.error("Shiteru API error", {
        status: aiResponse.status,
        elapsed_ms: Date.now() - aiStartedAt,
        details,
      });
      return jsonResponse({
        error: `Shiteru gagal membuat materi (HTTP ${aiResponse.status}). Coba lagi beberapa saat.`,
        code: "SHITERU_API_ERROR",
      }, 502);
    }

    const aiData = await aiResponse.json();
    const generatedText = aiData?.choices?.[0]?.message?.content;

    if (typeof generatedText !== "string" || !generatedText.trim()) {
      console.error(
        "Shiteru empty response",
        JSON.stringify(aiData).slice(0, 1200),
      );
      return jsonResponse({
        error: "Shiteru tidak mengembalikan konten materi.",
        code: "AI_EMPTY_RESPONSE",
      }, 502);
    }

    let lesson: unknown;
    try {
      lesson = parseJson(generatedText);
    } catch (error) {
      console.error(
        "Invalid JSON from Shiteru",
        errorMessage(error),
        generatedText.slice(0, 1600),
      );
      return jsonResponse({
        error: "Format materi dari AI tidak valid. Tekan coba lagi untuk membuat ulang.",
        code: "AI_INVALID_JSON",
      }, 502);
    }

    if (!validLesson(lesson)) {
      console.error(
        "Lesson schema validation failed",
        JSON.stringify(lesson).slice(0, 1800),
      );
      return jsonResponse({
        error: "Struktur materi AI belum sesuai format. Silakan coba lagi.",
        code: "AI_INVALID_LESSON",
      }, 502);
    }

    const { data: material, error: insertError } = await admin
      .from("materials")
      .insert({
        title: lesson.title,
        description: lesson.summary,
        content: JSON.stringify(lesson),
        material_type: "article",
        difficulty_level: targetLevel,
        estimated_minutes: duration,
        is_published: true,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(`Gagal menyimpan materi: ${insertError.message}`);
    }

    const { error: updateStepError } = await admin
      .from("learning_path_steps")
      .update({ material_id: material.id, status: "in_progress" })
      .eq("id", step.id)
      .eq("learning_path_id", path.id);

    if (updateStepError) {
      throw new Error(
        `Materi tersimpan, tetapi gagal menghubungkannya ke tahap: ${updateStepError.message}`,
      );
    }

    const { error: usageError } = await admin.from("ai_usage_events").insert({
      user_id: user.id,
      function_name: "generate-learning-material",
      model_name: SHITERU_MODEL,
      status: "success",
    });
    if (usageError) {
      console.warn("Gagal mencatat penggunaan AI:", usageError.message);
    }

    return jsonResponse({
      lesson,
      material_id: material.id,
      cached: false,
    });
  } catch (error) {
    const message = errorMessage(error);
    console.error("generate-learning-material failed", {
      message,
      name: error instanceof Error ? error.name : "UnknownError",
      user_id: userId,
    });

    const isTimeout = error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");

    if (isTimeout) {
      console.error("Shiteru material generation timed out", {
        timeout_ms: AI_TIMEOUT_MS,
        message,
        hint: "Periksa apakah request Shiteru selesai sebelum batas timeout; jika terus terjadi, pindahkan generasi ke durable queue/worker.",
      });
    }

    return jsonResponse({
      error: isTimeout
        ? "Pembuatan materi memerlukan waktu terlalu lama. Coba lagi; kuis tidak dibuat dalam proses ini."
        : "Gagal memuat atau menyimpan materi.",
      code: isTimeout ? "AI_TIMEOUT" : "INTERNAL_ERROR",
      details: message,
    }, isTimeout ? 504 : 500);
  }
});
