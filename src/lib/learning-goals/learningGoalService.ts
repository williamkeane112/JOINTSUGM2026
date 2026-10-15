import { supabase } from "../supabaseClient";

export async function getLearningGoalDetail(
  goalId: string,
  userId: string,
) {
  const [
    goalResult,
    inProgressAssessmentResult,
    completedAssessmentResult,
    pathResult,
  ] = await Promise.all([
    // 1. Ambil detail tujuan belajar
    supabase
      .from("learning_goals")
      .select("*")
      .eq("id", goalId)
      .eq("user_id", userId)
      .maybeSingle(),

    // 2. Ambil kuis yang masih berjalan
    supabase
      .from("diagnostic_assessments")
      .select("*")
      .eq("learning_goal_id", goalId)
      .eq("user_id", userId)
      .eq("status", "in_progress")
      .order("created_at", { ascending: false })
      .limit(1),

    // 3. Ambil evaluasi terakhir yang sudah selesai
    supabase
      .from("diagnostic_assessments")
      .select("*")
      .eq("learning_goal_id", goalId)
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1),

    // 4. Ambil learning path
    supabase
      .from("learning_paths")
      .select("*")
      .eq("goal_id", goalId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  // Tangani error query
  if (goalResult.error) throw goalResult.error;
  if (inProgressAssessmentResult.error) {
    throw inProgressAssessmentResult.error;
  }
  if (completedAssessmentResult.error) {
    throw completedAssessmentResult.error;
  }
  if (pathResult.error) throw pathResult.error;

  if (!goalResult.data) {
    throw new Error("Tujuan belajar tidak ditemukan.");
  }

  const inProgressAssessment =
    inProgressAssessmentResult.data?.[0] ?? null;

  const completedAssessment =
    completedAssessmentResult.data?.[0] ?? null;

  return {
    goal: goalResult.data,

    // Pertahankan properti assessment untuk kompatibilitas
    // dengan komponen yang sudah menggunakan properti ini.
    assessment: completedAssessment,

    // Asesmen yang belum selesai untuk tombol Lanjutkan Kuis.
    inProgressAssessment,

    // Asesmen selesai untuk menampilkan hasil evaluasi.
    completedAssessment,

    learningPath: pathResult.data?.[0] ?? null,
  };
}