
import { supabase } from "../supabaseClient";
import type {
  LearningPathStep,
  LearningStepStatus,
} from "../../types/learning-path";

/**
 * Mengambil seluruh tahap belajar berdasarkan learning path.
 */
export async function getLearningSteps(
  learningPathId: string
): Promise<LearningPathStep[]> {
  if (!learningPathId) {
    throw new Error("ID learning path tidak ditemukan.");
  }

  const { data, error } = await supabase
    .from("learning_path_steps")
    .select("*")
    .eq("learning_path_id", learningPathId)
    .order("order_sequence", { ascending: true });

  if (error) {
    throw new Error(`Gagal mengambil tahap belajar: ${error.message}`);
  }

  return (data ?? []) as LearningPathStep[];
}

/**
 * Mengambil satu tahap belajar berdasarkan ID.
 */
export async function getLearningStep(
  stepId: string
): Promise<LearningPathStep> {
  const { data, error } = await supabase
    .from("learning_path_steps")
    .select("*")
    .eq("id", stepId)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal mengambil tahap belajar: ${error.message}`);
  }

  if (!data) {
    throw new Error("Tahap belajar tidak ditemukan.");
  }

  return data as LearningPathStep;
}

/**
 * Memulai tahap belajar.
 * Tahap locked tidak boleh dimulai.
 */

export async function startLearningStep(
  stepId: string
): Promise<LearningPathStep> {
  if (!stepId) {
    throw new Error("ID tahap belajar tidak ditemukan.");
  }

  const step = await getLearningStep(stepId);

  if (step.status === "locked") {
    throw new Error("Selesaikan tahap sebelumnya terlebih dahulu.");
  }

  if (step.status === "completed" || step.status === "in_progress") {
    return step;
  }

  if (step.status !== "available") {
    throw new Error(
      `Tahap tidak dapat dimulai. Status saat ini: ${step.status}.`
    );
  }

  const { data, error } = await supabase
    .from("learning_path_steps")
    .update({ status: "in_progress" })
    .eq("id", stepId)
    .eq("status", "available")
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Gagal update status tahap:", error);

    throw new Error(
      `Gagal memulai tahap belajar: ${error.message}`
    );
  }

  if (data) {
    return data as LearningPathStep;
  }

  // Update tidak mengembalikan baris: periksa status terbaru.
  const latestStep = await getLearningStep(stepId);

  if (
    latestStep.status === "in_progress" ||
    latestStep.status === "completed"
  ) {
    return latestStep;
  }

  if (latestStep.status === "locked") {
    throw new Error("Selesaikan tahap sebelumnya terlebih dahulu.");
  }

  throw new Error(
    "Status tahap tidak berubah. Periksa kebijakan UPDATE RLS " +
    "pada tabel learning_path_steps di Supabase."
  );
}


/**
 * Menyelesaikan tahap belajar dan membuka tahap berikutnya.
 *
 * Catatan:
 * Untuk konsistensi ketika beberapa pengguna melakukan aksi bersamaan,
 * proses ini sebaiknya dipindahkan ke PostgreSQL RPC transaction.
 */
export async function completeLearningStep(
  stepId: string
): Promise<{
  completedStep: LearningPathStep;
  unlockedStep: LearningPathStep | null;
}> {
  const step = await getLearningStep(stepId);

  if (step.status === "locked") {
    throw new Error("Tahap ini masih terkunci.");
  }

  if (step.status === "completed") {
    const steps = await getLearningSteps(step.learning_path_id);
    const next = steps.find(
      (item) =>
        item.order_sequence === step.order_sequence + 1 &&
        item.status !== "locked"
    );

    return {
      completedStep: step,
      unlockedStep: next ?? null,
    };
  }

  const { data: completedData, error: completeError } = await supabase
    .from("learning_path_steps")
    .update({ status: "completed" })
    .eq("id", stepId)
    .in("status", ["available", "in_progress"])
    .select("*")
    .maybeSingle();

  if (completeError) {
    throw new Error(
      `Gagal menyelesaikan tahap: ${completeError.message}`
    );
  }

  if (!completedData) {
    throw new Error(
      "Status tahap berubah atau tahap tidak dapat diselesaikan."
    );
  }

  const completedStep = completedData as LearningPathStep;

  const { data: nextStep, error: nextError } = await supabase
    .from("learning_path_steps")
    .select("*")
    .eq("learning_path_id", step.learning_path_id)
    .eq("order_sequence", step.order_sequence + 1)
    .maybeSingle();

  if (nextError) {
    throw new Error(
      `Tahap selesai, tetapi tahap berikutnya gagal diambil: ${nextError.message}`
    );
  }

  let unlockedStep: LearningPathStep | null = null;

  if (nextStep && nextStep.status === "locked") {
    const { data: unlockedData, error: unlockError } = await supabase
      .from("learning_path_steps")
      .update({ status: "available" })
      .eq("id", nextStep.id)
      .eq("status", "locked")
      .select("*")
      .maybeSingle();

    if (unlockError) {
      throw new Error(
        `Tahap selesai, tetapi gagal membuka tahap berikutnya: ${unlockError.message}`
      );
    }

    unlockedStep = unlockedData
      ? (unlockedData as LearningPathStep)
      : null;
  } else if (nextStep) {
    unlockedStep = nextStep as LearningPathStep;
  }

  // Jika seluruh tahap selesai, tandai learning path sebagai completed.
  const { data: remainingSteps, error: remainingError } = await supabase
    .from("learning_path_steps")
    .select("id")
    .eq("learning_path_id", step.learning_path_id)
    .neq("status", "completed");

  if (remainingError) {
    throw new Error(
      `Tahap selesai, tetapi progres akhir gagal diperiksa: ${remainingError.message}`
    );
  }

  if (!remainingSteps || remainingSteps.length === 0) {
    const { error: pathError } = await supabase
      .from("learning_paths")
      .update({ status: "completed" })
      .eq("id", step.learning_path_id);

    if (pathError) {
      throw new Error(
        `Semua tahap selesai, tetapi status learning path gagal diperbarui: ${pathError.message}`
      );
    }
  }

  return { completedStep, unlockedStep };
}

/**
 * Mengubah status tahap.
 *
 * Gunakan startLearningStep() dan completeLearningStep()
 * untuk alur belajar normal.
 */
export async function updateLearningStepStatus(
  stepId: string,
  status: LearningStepStatus
): Promise<LearningPathStep> {
  if (status === "completed") {
    const result = await completeLearningStep(stepId);
    return result.completedStep;
  }

  if (status === "in_progress") {
    return startLearningStep(stepId);
  }

  const step = await getLearningStep(stepId);

  if (status === "locked" && step.status === "completed") {
    throw new Error("Tahap yang selesai tidak bisa dikunci kembali.");
  }

  const { data, error } = await supabase
    .from("learning_path_steps")
    .update({ status })
    .eq("id", stepId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Gagal memperbarui status tahap: ${error.message}`);
  }

  return data as LearningPathStep;
}
