
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
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_PUBLISHABLE_KEY =
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
  Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get(
  "SUPABASE_SERVICE_ROLE_KEY",
);
const SHITERU_API_KEY = Deno.env.get("SHITERU_API_KEY");
const SHITERU_MODEL = Deno.env.get("SHITERU_MODEL") ?? "gpt-6-astra";

const VALID_LEVELS = ["beginner", "intermediate", "advanced"] as const;

type Difficulty = (typeof VALID_LEVELS)[number];

type GeneratedStep = {
  title: string;
  description: string;
  learning_objectives: string[];
  estimated_minutes: number;
  prerequisite_indexes: number[];
};

type GeneratedPath = {
  title: string;
  description: string;
  difficulty_level: Difficulty;
  estimated_hours: number;
  steps: GeneratedStep[];
};


const CHECKPOINT_SIZE = 3;
const CHECKPOINT_PASSING_SCORE = 70;

type CheckpointRow = {
  user_id: string;
  learning_path_id: string;
  checkpoint_number: number;
  start_order_sequence: number;
  end_order_sequence: number;
  passing_score: number;
  best_score: number | null;
  passed_at: string | null;
  unlocked_at: string | null;
  updated_at: string;
};

/**
 * Membuat atau melengkapi checkpoint untuk path baru maupun path lama.
 * Checkpoint yang sudah ada tidak di-reset: best_score dan passed_at tetap.
 * Harus dipanggil dari Edge Function dengan admin/service-role client.
 */
async function ensureLearningPathCheckpoints(
  admin: ReturnType<typeof createClient>,
  userId: string,
  learningPathId: string,
) {
  const { data: steps, error: stepsError } = await admin
    .from("learning_path_steps")
    .select("order_sequence")
    .eq("learning_path_id", learningPathId)
    .order("order_sequence", { ascending: true });

  if (stepsError) throw stepsError;
  if (!steps?.length) {
    throw new Error("Learning path belum memiliki tahap untuk dibuat checkpoint.");
  }

  const sequences = steps
    .map((step) => Number(step.order_sequence))
    .filter((sequence) => Number.isInteger(sequence) && sequence > 0)
    .sort((a, b) => a - b);

  if (!sequences.length) {
    throw new Error("Tidak ditemukan order_sequence tahap yang valid.");
  }

  const now = new Date().toISOString();
  const expected: CheckpointRow[] = [];

  for (let startIndex = 0; startIndex < sequences.length; startIndex += CHECKPOINT_SIZE) {
    const group = sequences.slice(startIndex, startIndex + CHECKPOINT_SIZE);
    const checkpointNumber = Math.floor(startIndex / CHECKPOINT_SIZE) + 1;

    expected.push({
      user_id: userId,
      learning_path_id: learningPathId,
      checkpoint_number: checkpointNumber,
      start_order_sequence: group[0],
      end_order_sequence: group[group.length - 1],
      passing_score: CHECKPOINT_PASSING_SCORE,
      best_score: null,
      passed_at: null,
      unlocked_at: checkpointNumber === 1 ? now : null,
      updated_at: now,
    });
  }

  const { data: existing, error: existingError } = await admin
    .from("learning_path_checkpoints")
    .select("id, checkpoint_number, start_order_sequence, end_order_sequence, passing_score, best_score, passed_at, unlocked_at")
    .eq("user_id", userId)
    .eq("learning_path_id", learningPathId);

  if (existingError) throw existingError;

  const existingByNumber = new Map<number, Record<string, unknown>>(
    (existing ?? []).map((row) => [Number(row.checkpoint_number), row]),
  );

  const missing: CheckpointRow[] = [];

  for (const expectedRow of expected) {
    const oldRow = existingByNumber.get(expectedRow.checkpoint_number);

    if (!oldRow) {
      missing.push(expectedRow);
      continue;
    }

    // Selaraskan batas tahap yang lama, tetapi pertahankan progres kelulusan.
    const needsUpdate =
      Number(oldRow.start_order_sequence) !== expectedRow.start_order_sequence ||
      Number(oldRow.end_order_sequence) !== expectedRow.end_order_sequence ||
      Number(oldRow.passing_score) !== expectedRow.passing_score ||
      (expectedRow.checkpoint_number === 1 && !oldRow.unlocked_at);

    if (needsUpdate) {
      const updatePayload: Record<string, unknown> = {
        start_order_sequence: expectedRow.start_order_sequence,
        end_order_sequence: expectedRow.end_order_sequence,
        passing_score: expectedRow.passing_score,
        updated_at: now,
      };
      if (expectedRow.checkpoint_number === 1 && !oldRow.unlocked_at) {
        updatePayload.unlocked_at = now;
      }

      const { error: updateError } = await admin
        .from("learning_path_checkpoints")
        .update(updatePayload)
        .eq("id", oldRow.id)
        .eq("user_id", userId)
        .eq("learning_path_id", learningPathId);

      if (updateError) throw updateError;
    }
  }

  if (missing.length) {
    const { error: insertError } = await admin
      .from("learning_path_checkpoints")
      .insert(missing);

    if (insertError) throw insertError;
  }

  // Kembalikan jumlah checkpoint yang seharusnya ada.
  return expected.length;
}

function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

function parseJsonContent(content: unknown): unknown {
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Shiteru tidak mengembalikan konten JSON.");
  }

  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(cleaned);
}

function validateGeneratedPath(value: unknown): value is GeneratedPath {
  if (!value || typeof value !== "object") return false;

  const path = value as Record<string, unknown>;

  if (
    typeof path.title !== "string" ||
    !path.title.trim() ||
    typeof path.description !== "string" ||
    !path.description.trim() ||
    typeof path.difficulty_level !== "string" ||
    !VALID_LEVELS.includes(path.difficulty_level as Difficulty) ||
    typeof path.estimated_hours !== "number" ||
    !Number.isFinite(path.estimated_hours) ||
    path.estimated_hours <= 0 ||
    !Array.isArray(path.steps) ||
    path.steps.length < 4 ||
    path.steps.length > 8
  ) {
    return false;
  }

  return path.steps.every((value, index) => {
    if (!value || typeof value !== "object") return false;

    const step = value as Record<string, unknown>;

    if (
      typeof step.title !== "string" ||
      !step.title.trim() ||
      typeof step.description !== "string" ||
      !step.description.trim() ||
      !Array.isArray(step.learning_objectives) ||
      step.learning_objectives.length === 0 ||
      !step.learning_objectives.every(
        (objective) =>
          typeof objective === "string" && objective.trim().length > 0,
      ) ||
      !Number.isInteger(step.estimated_minutes) ||
      (step.estimated_minutes as number) <= 0 ||
      !Array.isArray(step.prerequisite_indexes)
    ) {
      return false;
    }

    const prerequisites = step.prerequisite_indexes;

    return (
      prerequisites.every(
        (n) =>
          Number.isInteger(n) &&
          n >= 0 &&
          n < index,
      ) &&
      new Set(prerequisites).size === prerequisites.length
    );
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method tidak diizinkan." }, 405);
  }

  if (
    !SUPABASE_URL ||
    !SUPABASE_PUBLISHABLE_KEY ||
    !SUPABASE_SERVICE_ROLE_KEY ||
    !SHITERU_API_KEY
  ) {
    console.error("Konfigurasi Edge Function belum lengkap.", {
      hasSupabaseUrl: Boolean(SUPABASE_URL),
      hasPublishableKey: Boolean(SUPABASE_PUBLISHABLE_KEY),
      hasServiceRoleKey: Boolean(SUPABASE_SERVICE_ROLE_KEY),
      hasShiteruKey: Boolean(SHITERU_API_KEY),
      hasShiteruModel: Boolean(SHITERU_MODEL),
    });

    return jsonResponse(
      { error: "Konfigurasi server belum lengkap. Periksa Supabase Secrets." },
      500,
    );
  }

  const authorization = req.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return jsonResponse({ error: "Token autentikasi tidak ditemukan." }, 401);
  }

  const userClient = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      global: { headers: { Authorization: authorization } },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  const token = authorization.slice("Bearer ".length);
  const { data: authData, error: authError } =
    await userClient.auth.getUser(token);

  if (authError || !authData.user) {
    return jsonResponse({ error: "Sesi login tidak valid." }, 401);
  }

  const user = authData.user;

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

  let goalId: string | null = null;
  let claimedGoal = false;
  let createdPathId: string | null = null;

  try {
    let body: Record<string, unknown>;

    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Body harus berupa JSON valid." }, 400);
    }

    goalId =
      typeof body.learning_goal_id === "string"
        ? body.learning_goal_id
        : null;

    if (!isUuid(goalId)) {
      return jsonResponse(
        { error: "learning_goal_id tidak valid." },
        400,
      );
    }

    // 1. Verifikasi kepemilikan learning goal.
    const { data: goal, error: goalError } = await admin
      .from("learning_goals")
      .select(
        "id, user_id, topic_id, requested_topic, description, target_level, target_outcome, status",
      )
      .eq("id", goalId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (goalError) throw goalError;

    if (!goal) {
      return jsonResponse(
        { error: "Learning goal tidak ditemukan." },
        404,
      );
    }

    // 2. Jika path sudah ada, gunakan kembali.
    const { data: existingPath, error: existingPathError } = await admin
      .from("learning_paths")
      .select("id, title, status, goal_id")
      .eq("goal_id", goalId)
      .maybeSingle();

    if (existingPathError) throw existingPathError;

    if (existingPath) {
      // Perbaiki checkpoint yang hilang pada learning path lama juga.
      const checkpointsCount = await ensureLearningPathCheckpoints(
        admin,
        user.id,
        existingPath.id,
      );

      const { error: readyExistingError } = await admin
        .from("learning_goals")
        .update({
          status: "ready",
          error_message: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", goalId)
        .eq("user_id", user.id);

      if (readyExistingError) throw readyExistingError;

      return jsonResponse({
        success: true,
        already_exists: true,
        learning_path_id: existingPath.id,
        title: existingPath.title,
        status: existingPath.status,
        checkpoints_count: checkpointsCount,
        checkpoint_size: CHECKPOINT_SIZE,
        checkpoints_repaired: true,
      });
    }

    // 3. Ambil nama topik dari katalog jika tersedia.
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

    // 4. Klaim goal agar dua request tidak memprosesnya bersamaan.
    const { data: claimed, error: claimError } = await admin
      .from("learning_goals")
      .update({
        status: "generating",
        error_message: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", goalId)
      .eq("user_id", user.id)
      .in("status", ["pending", "failed"])
      .select("id")
      .maybeSingle();

    if (claimError) throw claimError;

    if (!claimed) {
      return jsonResponse(
        {
          error:
            "Goal tidak dalam status yang bisa dibuat atau sedang diproses. Muat ulang halaman dan periksa statusnya.",
        },
        409,
      );
    }

    claimedGoal = true;

    // 5. Gunakan asesmen diagnostik terakhir yang selesai.
    const { data: assessment, error: assessmentError } = await admin
      .from("diagnostic_assessments")
      .select(
        "id, score, total_questions, skill_analysis, status, completed_at",
      )
      .eq("user_id", user.id)
      .eq("learning_goal_id", goalId)
      .eq("status", "completed")
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (assessmentError) throw assessmentError;

    if (!assessment) {
      throw new Error(
        "Selesaikan tes diagnostik terlebih dahulu sebelum membuat learning path.",
      );
    }

    // 6. Minta Shiteru menyusun jalur belajar.
    // Kunci jawaban tidak dibaca atau dikirim ke AI.
    const prompt = `
Kamu adalah perancang kurikulum adaptif untuk SkillPath AI.

Buat learning path dalam Bahasa Indonesia berdasarkan data berikut:
${JSON.stringify({
  topic: topicName,
  goal_description: goal.description,
  target_level: goal.target_level,
  target_outcome: goal.target_outcome,
  diagnostic_score: assessment.score,
  total_questions: assessment.total_questions,
  skill_analysis: assessment.skill_analysis,
})}

Aturan:
1. Buat 4 sampai 8 tahap belajar yang berurutan.
2. Sesuaikan tahap dengan skill_analysis dan hasil diagnostik.
3. Prioritaskan kemampuan dengan level needs_improvement, kemudian developing.
4. Jangan mengulang materi yang sudah dikuasai tanpa alasan pedagogis.
5. Setiap tahap harus memiliki tujuan pembelajaran yang konkret.
6. prerequisite_indexes adalah indeks tahap sebelumnya, dimulai dari 0.
7. Jangan membuat prerequisite yang merujuk tahap itu sendiri atau tahap setelahnya.
8. estimated_minutes harus bilangan bulat positif.
9. difficulty_level harus beginner, intermediate, atau advanced.
10. Jangan membuat material_id. Materi katalog akan dipetakan terpisah.
11. Hanya keluarkan JSON, tanpa Markdown atau teks tambahan.

Format:
{
  "title": "Judul learning path",
  "description": "Deskripsi",
  "difficulty_level": "beginner",
  "estimated_hours": 10,
  "steps": [
    {
      "title": "Judul tahap",
      "description": "Deskripsi tahap",
      "learning_objectives": ["Tujuan 1", "Tujuan 2"],
      "estimated_minutes": 60,
      "prerequisite_indexes": []
    }
  ]
}
`;

    let aiResponse: Response;

    try {
      aiResponse = await fetch(
        "https://ai.shiteru.id/v1/chat/completions",
        {
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
                  "Kamu adalah perancang learning path SkillPath AI. Kembalikan JSON valid sesuai struktur yang diminta.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.4,
          }),
          signal: AbortSignal.timeout(90000),
        },
      );
    } catch (error) {
      console.error("Shiteru request failed:", error);
      throw new Error("Tidak dapat menghubungi Shiteru. Coba lagi nanti.");
    }

    if (!aiResponse.ok) {
      const details = await aiResponse.text();

      console.error("Shiteru API error:", {
        status: aiResponse.status,
        details: details.slice(0, 2000),
      });

      throw new Error(
        `Shiteru gagal membuat learning path (HTTP ${aiResponse.status}).`,
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData?.choices?.[0]?.message?.content;
    const generated = parseJsonContent(content);

    if (!validateGeneratedPath(generated)) {
      console.error("Struktur learning path tidak valid.");
      throw new Error(
        "Format learning path dari AI tidak valid. Silakan coba lagi.",
      );
    }

    const path = generated;

    // 7. Simpan parent learning path.
    const { data: savedPath, error: savePathError } = await admin
      .from("learning_paths")
      .insert({
        goal_id: goalId,
        user_id: user.id,
        title: path.title.trim(),
        description: path.description.trim(),
        difficulty_level: path.difficulty_level,
        estimated_hours: path.estimated_hours,
        generation_version: 1,
        status: "draft",
      })
      .select("id, title, status")
      .single();

    if (savePathError) {
      // Jika request lain menang lebih dahulu, kembalikan hasilnya.
      if (savePathError.code === "23505") {
        const { data: winner } = await admin
          .from("learning_paths")
          .select("id, title, status")
          .eq("goal_id", goalId)
          .maybeSingle();

        if (winner) {
          await admin
            .from("learning_goals")
            .update({
              status: "ready",
              error_message: null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", goalId)
            .eq("user_id", user.id);

          return jsonResponse({
            success: true,
            already_exists: true,
            learning_path_id: winner.id,
            title: winner.title,
            status: winner.status,
          });
        }
      }

      throw savePathError;
    }

    createdPathId = savedPath.id;

    // 8. Simpan semua tahap terlebih dahulu.
    const stepRows = path.steps.map((step, index) => ({
      learning_path_id: savedPath.id,
      material_id: null,
      title: step.title.trim(),
      description: step.description.trim(),
      learning_objectives: step.learning_objectives,
      prerequisite_step_ids: [],
      order_sequence: index + 1,
      estimated_minutes: step.estimated_minutes,
      status: index === 0 ? "available" : "locked",
    }));

    const { data: savedSteps, error: saveStepsError } = await admin
      .from("learning_path_steps")
      .insert(stepRows)
      .select("id, order_sequence");

    if (saveStepsError) throw saveStepsError;

    // Urutkan ID tahap agar indeks dari AI konsisten.
    const stepIdByIndex = new Map<number, string>(
      savedSteps.map((step) => [step.order_sequence - 1, step.id]),
    );

    if (savedSteps.length !== path.steps.length) {
      throw new Error("Jumlah tahap yang tersimpan tidak sesuai.");
    }

    // 9. Simpan relasi prasyarat antar tahap.
    for (let index = 0; index < path.steps.length; index++) {
      const prerequisiteIds = path.steps[index].prerequisite_indexes.map(
        (prerequisiteIndex) => stepIdByIndex.get(prerequisiteIndex)!,
      );

      if (prerequisiteIds.length === 0) continue;

      const currentStepId = stepIdByIndex.get(index);

      if (!currentStepId) {
        throw new Error("ID tahap tidak ditemukan.");
      }

      const { error: prerequisiteError } = await admin
        .from("learning_path_steps")
        .update({
          prerequisite_step_ids: prerequisiteIds,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentStepId)
        .eq("learning_path_id", savedPath.id);

      if (prerequisiteError) throw prerequisiteError;
    }

    // 10. Buat checkpoint otomatis setelah seluruh tahap dan prasyarat tersimpan.
    const checkpointsCount = await ensureLearningPathCheckpoints(
      admin,
      user.id,
      savedPath.id,
    );

    // 11. Tandai goal siap setelah path, tahap, prasyarat, dan checkpoint tersimpan.
    const { error: readyError } = await admin
      .from("learning_goals")
      .update({
        status: "ready",
        error_message: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", goalId)
      .eq("user_id", user.id);

    if (readyError) throw readyError;

    return jsonResponse({
      success: true,
      already_exists: false,
      learning_path_id: savedPath.id,
      title: savedPath.title,
      status: savedPath.status,
      steps_count: savedSteps.length,
      checkpoints_count: checkpointsCount,
      checkpoint_size: CHECKPOINT_SIZE,
      passing_score: CHECKPOINT_PASSING_SCORE,
    });
  } catch (error) {
    console.error("generate-learning-path error:", error);

    // Hapus parent untuk menghapus seluruh children via ON DELETE CASCADE.
    if (createdPathId) {
      const { error: rollbackError } = await admin
        .from("learning_paths")
        .delete()
        .eq("id", createdPathId)
        .eq("user_id", user.id);

      if (rollbackError) {
        console.error("Rollback learning path gagal:", rollbackError);
      }
    }

    if (claimedGoal && goalId) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal membuat learning path.";

      const { error: statusError } = await admin
        .from("learning_goals")
        .update({
          status: "failed",
          error_message: message.slice(0, 1000),
          updated_at: new Date().toISOString(),
        })
        .eq("id", goalId)
        .eq("user_id", user.id);

      if (statusError) {
        console.error("Gagal memperbarui status goal:", statusError);
      }
    }

    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat membuat learning path.",
      },
      500,
    );
  }
});
