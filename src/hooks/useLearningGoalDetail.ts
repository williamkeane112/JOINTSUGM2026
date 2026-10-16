import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabaseClient";
import { getLearningGoalDetail } from "../lib/learning-goals/learningGoalService";
import { getCurrentUserName } from "../lib/user/getCurrentUserName";

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
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate("/auth", { replace: true });
        return;
      }

      // Ambil detail tujuan belajar dan nama dari sumber yang sama.
      const [detail, resolvedName] = await Promise.all([
        getLearningGoalDetail(goalId, user.id),
        getCurrentUserName(),
      ]);

      setGoal(detail.goal ?? null);
      setAssessment(detail.assessment ?? null);

      setCompletedAssessment(
        detail.completedAssessment ?? detail.assessment ?? null,
      );

      setInProgressAssessment(detail.inProgressAssessment ?? null);
      setLearningPath(detail.learningPath ?? null);
      setStudentName(resolvedName || "Pelajar");
    } catch (err: unknown) {
      console.error("Gagal memuat detail tujuan belajar:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat data tujuan belajar.",
      );
    } finally {
      setLoading(false);
    }
  }, [goalId, navigate]);

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
    pathGenerated: Boolean(learningPath),
    reload,
  };
}