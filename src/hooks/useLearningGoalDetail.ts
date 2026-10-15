import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabaseClient";
import { getLearningGoalDetail } from "../lib/learning-goals/learningGoalService";

export function useLearningGoalDetail(goalId?: string) {
  const navigate = useNavigate();

  const [goal, setGoal] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [inProgressAssessment, setInProgressAssessment] =
    useState<any>(null);
  const [completedAssessment, setCompletedAssessment] =
    useState<any>(null);
  const [learningPath, setLearningPath] = useState<any>(null);
  const [studentName, setStudentName] = useState("Pelajar");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!goalId) {
      setGoal(null);
      setAssessment(null);
      setInProgressAssessment(null);
      setCompletedAssessment(null);
      setLearningPath(null);
      setError("ID tujuan belajar tidak ditemukan.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Validasi sesi dan pengguna.
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate("/auth", { replace: true });
        return;
      }

      // 2. Ambil detail tujuan belajar dan profil secara bersamaan.
      const [detail, profileResult] = await Promise.all([
        getLearningGoalDetail(goalId, user.id),

        supabase
          .from("users")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle(),
      ]);

      // 3. Perbarui state tujuan belajar.
      setGoal(detail.goal);

      // Asesmen selesai untuk hasil diagnostik.
      setAssessment(detail.assessment);
      setCompletedAssessment(
        detail.completedAssessment ?? detail.assessment,
      );

      // Asesmen yang masih berlangsung.
      setInProgressAssessment(
        detail.inProgressAssessment,
      );

      // Learning path terbaru, termasuk langkah-langkahnya
      // jika learningGoalService mengambil relasi tersebut.
      setLearningPath(detail.learningPath);

      // 4. Perbarui nama pengguna.
      if (profileResult.error) {
        console.warn(
          "Gagal memuat profil pengguna:",
          profileResult.error.message,
        );
      }

      setStudentName(
        profileResult.data?.full_name?.trim() || "Pelajar",
      );
    } catch (err: unknown) {
      console.error(
        "Gagal memuat detail tujuan belajar:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat data tujuan belajar.",
      );
    } finally {
      setLoading(false);
    }
  }, [goalId, navigate]);

  // Muat data ketika goalId berubah.
  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    goal,
    assessment,
    inProgressAssessment,
    completedAssessment,
    learningPath,
    studentName,
    loading,
    error,

    // Path dianggap tersedia jika record berhasil ditemukan.
    pathGenerated: Boolean(learningPath),

    // Dapat dipanggil setelah Edge Function selesai.
    reload,
  };
}