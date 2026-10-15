import { supabase } from "../supabaseClient";
import type { GeneratedLesson, LearningPathRecord, LearningStepRecord } from "./types";

type GenerateMaterialResponse = {
  lesson: GeneratedLesson;
  material_id: string;
  cached: boolean;
  error?: string;
};

export async function getLearningStep(stepId: string) {
  const { data, error } = await supabase
    .from("learning_path_steps")
    .select("id, learning_path_id, material_id, title, description, learning_objectives, order_sequence, estimated_minutes, status")
    .eq("id", stepId)
    .maybeSingle();

  if (error) throw new Error(`Gagal memuat tahap: ${error.message}`);
  if (!data) throw new Error("Tahap pembelajaran tidak ditemukan atau kamu tidak memiliki akses.");
  return data as LearningStepRecord;
}

export async function getLearningPath(pathId: string) {
  const { data, error } = await supabase
    .from("learning_paths")
    .select("id, title, description, difficulty_level, goal_id")
    .eq("id", pathId)
    .maybeSingle();

  if (error) throw new Error(`Gagal memuat learning path: ${error.message}`);
  if (!data) throw new Error("Learning path tidak ditemukan atau kamu tidak memiliki akses.");
  return data as LearningPathRecord;
}

export async function getPathSteps(pathId: string) {
  const { data, error } = await supabase
    .from("learning_path_steps")
    .select("id, learning_path_id, material_id, title, description, learning_objectives, order_sequence, estimated_minutes, status")
    .eq("learning_path_id", pathId)
    .order("order_sequence", { ascending: true });

  if (error) throw new Error(`Gagal memuat daftar tahap: ${error.message}`);
  return (data ?? []) as LearningStepRecord[];
}

export async function getLearningStepForPath(
  pathId: string,
  stepId: string,
): Promise<LearningStepRecord> {
  const { data, error } = await supabase
    .from("learning_path_steps")
    .select(
      "id, learning_path_id, material_id, title, description, learning_objectives, order_sequence, estimated_minutes, status",
    )
    .eq("id", stepId)
    .eq("learning_path_id", pathId)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal memuat tahap: ${error.message}`);
  }

  if (!data) {
    throw new Error(
      "Tahap tidak ditemukan pada learning path yang dipilih.",
    );
  }

  return data as LearningStepRecord;
}

export async function generateOrGetLesson(stepId: string): Promise<GenerateMaterialResponse> {
  const { data, error } = await supabase.functions.invoke<GenerateMaterialResponse>(
    "generate-learning-material",
    { body: { step_id: stepId } },
  );

  if (error) {
    const context = (error as { context?: { json?: () => Promise<unknown>; status?: number } }).context;
    let details = "";
    try {
      const body = await context?.json?.();
      if (body && typeof body === "object" && "error" in body) {
        details = String((body as { error: unknown }).error);
      }
    } catch {
      // Gunakan pesan fungsi jika response bukan JSON.
    }
    throw new Error(details || error.message || "AI gagal membuat materi. Silakan coba lagi.");
  }

  if (!data) throw new Error("Server tidak mengembalikan materi.");
  if (data.error) throw new Error(data.error);
  if (!data.lesson || !data.material_id) {
    throw new Error("Format materi dari server tidak lengkap.");
  }

  return data;
}

export async function markStepInProgress(stepId: string) {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw new Error(authError.message);
  const user = authData.user;
  if (!user) throw new Error("Sesi login tidak ditemukan. Silakan login kembali.");

  const { error: progressError } = await supabase
    .from("step_progress")
    .upsert(
      {
        user_id: user.id,
        step_id: stepId,
        status: "in_progress",
        progress_percent: 0,
        started_at: new Date().toISOString(),
      },
      { onConflict: "user_id,step_id" },
    );

  if (progressError) throw new Error(`Materi dibuat, tetapi progres gagal disimpan: ${progressError.message}`);
}
