
import { supabase } from "../supabaseClient";
import type {
  LearningPath,
  LearningPathStep,
  LearningProgressSummary,
} from "../../types/learning-path";

/**
 * Mengambil ringkasan progres satu learning path.
 */
export async function getLearningProgress(
  learningPathId: string
): Promise<LearningProgressSummary> {
  if (!learningPathId) {
    throw new Error("ID learning path tidak ditemukan.");
  }

  const { data, error } = await supabase
    .from("learning_path_steps")
    .select("id, status")
    .eq("learning_path_id", learningPathId);

  if (error) {
    throw new Error(`Gagal mengambil progres belajar: ${error.message}`);
  }

  const steps = data ?? [];
  const total = steps.length;

  const completed = steps.filter(
    (step) => step.status === "completed"
  ).length;

  const available = steps.filter(
    (step) => step.status === "available"
  ).length;

  const inProgress = steps.filter(
    (step) => step.status === "in_progress"
  ).length;

  const locked = steps.filter(
    (step) => step.status === "locked"
  ).length;

  return {
    learning_path_id: learningPathId,
    total_steps: total,
    completed_steps: completed,
    available_steps: available,
    in_progress_steps: inProgress,
    locked_steps: locked,
    progress_percentage:
      total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

/**
 * Mengambil learning path milik pengguna yang sedang login.
 */
export async function getMyLearningPaths(): Promise<LearningPath[]> {
  const { data: authData, error: authError } =
    await supabase.auth.getUser();

  if (authError || !authData.user) {
    throw new Error("Silakan login untuk melihat learning path.");
  }

  const { data, error } = await supabase
    .from("learning_paths")
    .select("*")
    .eq("user_id", authData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Gagal mengambil learning path: ${error.message}`);
  }

  return (data ?? []) as LearningPath[];
}

/**
 * Mengambil progres seluruh learning path milik pengguna.
 */
export async function getMyLearningProgress(): Promise<
  LearningProgressSummary[]
> {
  const paths = await getMyLearningPaths();

  const summaries = await Promise.all(
    paths.map((path) => getLearningProgress(path.id))
  );

  return summaries;
}

/**
 * Mengambil tahap yang dapat dikerjakan berikutnya.
 */
export async function getNextAvailableStep(
  learningPathId: string
): Promise<LearningPathStep | null> {
  const { data, error } = await supabase
    .from("learning_path_steps")
    .select("*")
    .eq("learning_path_id", learningPathId)
    .in("status", ["available", "in_progress"])
    .order("order_sequence", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Gagal mengambil tahap selanjutnya: ${error.message}`
    );
  }

  return data as LearningPathStep | null;
}
