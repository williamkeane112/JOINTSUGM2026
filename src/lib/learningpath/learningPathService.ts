import { supabase } from "../supabaseClient";

export interface GenerateLearningPathResult {
  success: boolean;
  learning_path_id: string;
  message?: string;
  [key: string]: unknown;
}

/**
 * Membuat learning path menggunakan Supabase Edge Function.
 */
export async function generateLearningPath(
  learningGoalId: string
): Promise<GenerateLearningPathResult> {
  if (!learningGoalId) {
    throw new Error("ID tujuan belajar tidak ditemukan.");
  }

  const { data, error } = await supabase.functions.invoke(
    "generate-learning-path",
    {
      body: {
        learning_goal_id: learningGoalId,
      },
    }
  );

  if (error) {
    console.error("Edge Function generate-learning-path gagal:", error);

    throw new Error(
      error.message || "Gagal memanggil generator learning path."
    );
  }

  if (!data?.success || !data?.learning_path_id) {
    console.error("Respons generate-learning-path tidak valid:", data);

    throw new Error(
      data?.error ||
        data?.message ||
        "Learning path tidak berhasil dibuat."
    );
  }

  // Kembalikan respons sukses dari Edge Function.
  // Jangan menggunakan pathResult karena variabel tersebut tidak ada.
  return data as GenerateLearningPathResult;
}
