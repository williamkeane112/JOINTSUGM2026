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

      const [detail, profile] = await Promise.all([
        getLearningGoalDetail(goalId, user.id),
        supabase
          .from("users")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle(),
      ]);

      setGoal(detail.goal);
      setAssessment(detail.assessment);
      setInProgressAssessment(detail.inProgressAssessment);
      setCompletedAssessment(detail.completedAssessment);
      setLearningPath(detail.learningPath);
      setStudentName(
        profile.data?.full_name?.trim() || "Pelajar",
      );
    } catch (err) {
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
