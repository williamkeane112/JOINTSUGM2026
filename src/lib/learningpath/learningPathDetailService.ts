
import { supabase } from "../supabaseClient";

import type {
  LearningPath,
  LearningPathDetail,
  LearningPathStep,
  LearningProgressSummary,
  LearningStepDetail,
} from "../../types/learning-path";

/**
 * Mengambil detail learning path beserta semua tahapnya.
 */
export async function getLearningPathDetail(
  learningPathId: string
): Promise<LearningPathDetail> {
  if (!learningPathId) {
    throw new Error("ID learning path tidak ditemukan.");
  }

  const { data: path, error: pathError } = await supabase
    .from("learning_paths")
    .select("*")
    .eq("id", learningPathId)
    .maybeSingle();

  if (pathError) {
    throw new Error(
      `Gagal mengambil learning path: ${pathError.message}`
    );
  }

  if (!path) {
    throw new Error(
      "Learning path tidak ditemukan atau kamu tidak memiliki akses."
    );
  }

  const { data: steps, error: stepsError } = await supabase
    .from("learning_path_steps")
    .select("*")
    .eq("learning_path_id", learningPathId)
    .order("order_sequence", { ascending: true });

  if (stepsError) {
    throw new Error(
      `Gagal mengambil tahapan belajar: ${stepsError.message}`
    );
  }

  const learningPathSteps =
    (steps ?? []) as LearningPathStep[];

  const totalSteps = learningPathSteps.length;

  const completedSteps = learningPathSteps.filter(
    (step) => step.status === "completed"
  ).length;

  const progressPercentage =
    totalSteps > 0
      ? Math.round((completedSteps / totalSteps) * 100)
      : 0;

  return {
    ...(path as LearningPath),
    learning_path_steps: learningPathSteps,
    total_steps: totalSteps,
    completed_steps: completedSteps,
    progress_percentage: progressPercentage,
  };
}

/**
 * Mengambil satu tahap belajar berdasarkan ID.
 * Sekaligus menyediakan tahap sebelumnya dan berikutnya.
 */
export async function getLearningStepDetail(
  stepId: string
): Promise<LearningStepDetail> {
  if (!stepId) {
    throw new Error("ID tahap belajar tidak ditemukan.");
  }

  const { data: step, error: stepError } = await supabase
    .from("learning_path_steps")
    .select("*")
    .eq("id", stepId)
    .maybeSingle();

  if (stepError) {
    throw new Error(
      `Gagal mengambil tahap belajar: ${stepError.message}`
    );
  }

  if (!step) {
    throw new Error(
      "Tahap belajar tidak ditemukan atau kamu tidak memiliki akses."
    );
  }

  const currentStep = step as LearningPathStep;

  const learningPath = await getLearningPathDetail(
    currentStep.learning_path_id
  );

  const steps = learningPath.learning_path_steps;

  const currentIndex = steps.findIndex(
    (item) => item.id === currentStep.id
  );

  if (currentIndex === -1) {
    throw new Error(
      "Tahap belajar tidak ditemukan dalam learning path."
    );
  }

  return {
    step: currentStep,
    learningPath,
    previousStep:
      currentIndex > 0 ? steps[currentIndex - 1] : null,
    nextStep:
      currentIndex < steps.length - 1
        ? steps[currentIndex + 1]
        : null,
  };
}

/**
 * Mengambil ringkasan progres learning path.
 */
export async function getLearningProgressSummary(
  learningPathId: string
): Promise<LearningProgressSummary> {
  const detail = await getLearningPathDetail(learningPathId);

  const steps = detail.learning_path_steps;

  return {
    learning_path_id: detail.id,
    total_steps: steps.length,
    completed_steps: steps.filter(
      (step) => step.status === "completed"
    ).length,
    available_steps: steps.filter(
      (step) => step.status === "available"
    ).length,
    in_progress_steps: steps.filter(
      (step) => step.status === "in_progress"
    ).length,
    locked_steps: steps.filter(
      (step) => step.status === "locked"
    ).length,
    progress_percentage: detail.progress_percentage,
  };
}
