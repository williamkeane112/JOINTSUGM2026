import { supabase } from "../supabaseClient";

import type {

  LearningPathStep,

  LearningStepStatus,

} from "../../types/learning-path";

type LearningPathCheckpoint = {

  id: string;

  user_id: string;

  learning_path_id: string;

  checkpoint_number: number;

  start_order_sequence: number;

  end_order_sequence: number;

  passing_score: number;

  best_score: number | null;

  passed_at: string | null;

  unlocked_at: string | null;

};

export async function getLearningSteps(

  learningPathId: string,

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

export async function getLearningStep(

  stepId: string,

): Promise<LearningPathStep> {

  if (!stepId) {

    throw new Error("ID tahap belajar tidak ditemukan.");

  }

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

async function getLearningPathCheckpoint(

  userId: string,

  learningPathId: string,

  orderSequence: number,

): Promise<LearningPathCheckpoint> {

  if (orderSequence <= 0 || orderSequence % 3 !== 0) {

    throw new Error("Nomor tahap bukan batas checkpoint yang valid.");

  }

  const checkpointNumber = Math.floor(orderSequence / 3);

  const { data, error } = await supabase

    .from("learning_path_checkpoints")

    .select(

      [

        "id",

        "user_id",

        "learning_path_id",

        "checkpoint_number",

        "start_order_sequence",

        "end_order_sequence",

        "passing_score",

        "best_score",

        "passed_at",

        "unlocked_at",

      ].join(", "),

    )

    .eq("user_id", userId)

    .eq("learning_path_id", learningPathId)

    .eq("checkpoint_number", checkpointNumber)

    .maybeSingle();

  if (error) {

    console.error("Gagal mengambil checkpoint:", error);

    throw new Error(

      `Gagal membaca checkpoint tahap ${orderSequence}: ${error.message}. ` +

        "Pastikan sesi login valid dan policy SELECT RLS mengizinkan " +

        "pengguna membaca checkpoint miliknya.",

    );

  }

  if (!data) {

    throw new Error(

      `Checkpoint untuk tahap ${orderSequence} belum tersedia. ` +

        "Checkpoint harus dibuat oleh generator learning path di backend. " +

        "Silakan buat atau perbaiki checkpoint melalui proses generator, " +

        "kemudian muat ulang halaman.",

    );

  }

  // Fallback runtime parsing untuk kondisi tipe Supabase belum mengenali tabel.
  // Tetap validasi data sebelum digunakan agar kesalahan skema tidak diam-diam lolos.
  const row = data as unknown as Record<string, unknown>;

  if (
    typeof row.id !== "string" ||
    typeof row.user_id !== "string" ||
    typeof row.learning_path_id !== "string" ||
    typeof row.checkpoint_number !== "number" ||
    typeof row.start_order_sequence !== "number" ||
    typeof row.end_order_sequence !== "number" ||
    typeof row.passing_score !== "number" ||
    (row.best_score !== null && typeof row.best_score !== "number") ||
    (row.passed_at !== null && typeof row.passed_at !== "string") ||
    (row.unlocked_at !== null && typeof row.unlocked_at !== "string")
  ) {
    throw new Error(
      "Struktur data checkpoint tidak sesuai. Periksa tabel " +
        "learning_path_checkpoints dan tipe Database Supabase.",
    );
  }

  const checkpoint: LearningPathCheckpoint = {
    id: row.id,
    user_id: row.user_id,
    learning_path_id: row.learning_path_id,
    checkpoint_number: row.checkpoint_number,
    start_order_sequence: row.start_order_sequence,
    end_order_sequence: row.end_order_sequence,
    passing_score: row.passing_score,
    best_score: row.best_score,
    passed_at: row.passed_at,
    unlocked_at: row.unlocked_at,
  };

  if (

    checkpoint.user_id !== userId ||

    checkpoint.learning_path_id !== learningPathId

  ) {

    throw new Error(

      "Checkpoint tidak cocok dengan pengguna atau learning path aktif.",

    );

  }

  if (checkpoint.end_order_sequence !== orderSequence) {

    throw new Error(

      `Konfigurasi checkpoint ${checkpointNumber} tidak sesuai dengan ` +

        `tahap ${orderSequence}.`,

    );

  }

  return checkpoint;

}

export async function startLearningStep(

  stepId: string,

): Promise<LearningPathStep> {

  if (!stepId) {

    throw new Error("ID tahap belajar tidak ditemukan.");

  }

  const step = await getLearningStep(stepId);

  if (step.status === "locked") {

    throw new Error("Selesaikan tahap sebelumnya terlebih dahulu.");

  }

  if (

    step.status === "completed" ||

    step.status === "in_progress"

  ) {

    return step;

  }

  if (step.status !== "available") {

    throw new Error(

      `Tahap tidak dapat dimulai. Status saat ini: ${step.status}.`,

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

    throw new Error(

      `Gagal memulai tahap belajar: ${error.message}`,

    );

  }

  if (data) {

    return data as LearningPathStep;

  }

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

      "pada tabel learning_path_steps di Supabase.",

  );

}

async function unlockNextLearningStep(

  learningPathId: string,

  currentOrderSequence: number,

): Promise<LearningPathStep | null> {

  const { data: nextStep, error: nextError } = await supabase

    .from("learning_path_steps")

    .select("*")

    .eq("learning_path_id", learningPathId)

    .eq("order_sequence", currentOrderSequence + 1)

    .maybeSingle();

  if (nextError) {

    throw new Error(

      `Gagal mengambil tahap berikutnya: ${nextError.message}`,

    );

  }

  if (!nextStep) {

    return null;

  }

  if (nextStep.status !== "locked") {

    return nextStep as LearningPathStep;

  }

  const { data: unlocked, error: unlockError } = await supabase

    .from("learning_path_steps")

    .update({ status: "available" })

    .eq("id", nextStep.id)

    .eq("status", "locked")

    .select("*")

    .maybeSingle();

  if (unlockError) {

    throw new Error(

      `Gagal membuka tahap berikutnya: ${unlockError.message}`,

    );

  }

  if (unlocked) {

    return unlocked as LearningPathStep;

  }

  // Mungkin sudah dibuka oleh request lain.*

  const { data: latestNextStep, error: latestError } = await supabase

    .from("learning_path_steps")

    .select("*")

    .eq("id", nextStep.id)

    .maybeSingle();

  if (latestError) {

    throw new Error(

      `Gagal memeriksa status tahap berikutnya: ${latestError.message}`,

    );

  }

  return (latestNextStep as LearningPathStep | null) ?? null;

}

async function updateLearningPathCompletion(

  learningPathId: string,

): Promise<void> {

  const { data: remainingSteps, error: remainingError } = await supabase

    .from("learning_path_steps")

    .select("id")

    .eq("learning_path_id", learningPathId)

    .neq("status", "completed");

  if (remainingError) {

    throw new Error(

      `Gagal memeriksa progres akhir: ${remainingError.message}`,

    );

  }

  if (remainingSteps && remainingSteps.length > 0) {

    return;

  }

  const { error: pathError } = await supabase

    .from("learning_paths")

    .update({ status: "completed" })

    .eq("id", learningPathId);

  if (pathError) {

    throw new Error(

      `Semua tahap selesai, tetapi status learning path gagal diperbarui: ` +

        pathError.message,

    );

  }

}

export async function completeLearningStep(

  stepId: string,

): Promise<{

  completedStep: LearningPathStep;

  unlockedStep: LearningPathStep | null;

}> {

  if (!stepId) {

    throw new Error("ID tahap belajar tidak ditemukan.");

  }

  const step = await getLearningStep(stepId);

  if (step.status === "locked") {

    throw new Error("Tahap ini masih terkunci.");

  }

  const {

    data: { user },

    error: authError,

  } = await supabase.auth.getUser();

  if (authError || !user) {

    throw new Error(

      "Sesi login tidak ditemukan. Silakan login kembali.",

    );

  }

  const isCheckpointBoundary =

    step.order_sequence > 0 &&

    step.order_sequence % 3 === 0;

  let checkpointPassed = false;

  if (isCheckpointBoundary) {

    const checkpoint = await getLearningPathCheckpoint(

      user.id,

      step.learning_path_id,

      step.order_sequence,

    );

    checkpointPassed = Boolean(checkpoint.passed_at);

  }

  // Jika tahap sudah selesai, jangan mengulang update.*

  if (step.status === "completed") {

    let unlockedStep: LearningPathStep | null = null;

    if (!isCheckpointBoundary || checkpointPassed) {

      unlockedStep = await unlockNextLearningStep(

        step.learning_path_id,

        step.order_sequence,

      );

    }

    await updateLearningPathCompletion(step.learning_path_id);

    return {

      completedStep: step,

      unlockedStep,

    };

  }

  if (!["available", "in_progress"].includes(step.status)) {

    throw new Error(

      `Tahap tidak dapat diselesaikan. Status: ${step.status}.`,

    );

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

      `Gagal menyelesaikan tahap: ${completeError.message}`,

    );

  }

  if (!completedData) {

    // Periksa apakah request lain sudah menyelesaikan tahap.*

    const latestStep = await getLearningStep(stepId);

    if (latestStep.status !== "completed") {

      throw new Error(

        "Tahap tidak berubah. Muat ulang halaman dan coba kembali.",

      );

    }

    const canUnlock =

      !isCheckpointBoundary || checkpointPassed;

    const unlockedStep = canUnlock

      ? await unlockNextLearningStep(

          latestStep.learning_path_id,

          latestStep.order_sequence,

        )

      : null;

    await updateLearningPathCompletion(latestStep.learning_path_id);

    return {

      completedStep: latestStep,

      unlockedStep,

    };

  }

  const completedStep = completedData as LearningPathStep;

  let unlockedStep: LearningPathStep | null = null;

  if (!isCheckpointBoundary || checkpointPassed) {

    unlockedStep = await unlockNextLearningStep(

      completedStep.learning_path_id,

      completedStep.order_sequence,

    );

  }

  await updateLearningPathCompletion(completedStep.learning_path_id);

  return {

    completedStep,

    unlockedStep,

  };

}

export async function updateLearningStepStatus(

  stepId: string,

  status: LearningStepStatus,

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

    throw new Error(

      `Gagal memperbarui status tahap: ${error.message}`,

    );

  }

  return data as LearningPathStep;

}
