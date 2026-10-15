
import { useCallback, useEffect, useState } from "react";

import type {
  LearningPathDetail,
  LearningPathStep,
  LearningProgressSummary,
} from "../types/learning-path";

import { getLearningPathDetail } from "../lib/learningpath/learningPathDetailService";

import {
  completeLearningStep,
  startLearningStep,
} from "../lib/learningpath/learningStepService";

import { getLearningProgress } from "../lib/learningpath/learningProgressService";

interface UseLearningPathReturn {
  learningPath: LearningPathDetail | null;
  progress: LearningProgressSummary | null;
  loading: boolean;
  actionLoading: boolean;
  error: string;
  reload: () => Promise<void>;
  startStep: (stepId: string) => Promise<LearningPathStep>;
  completeStep: (
    stepId: string
  ) => Promise<{
    completedStep: LearningPathStep;
    unlockedStep: LearningPathStep | null;
  }>;
}

export function useLearningPath(
  learningPathId?: string
): UseLearningPathReturn {
  const [learningPath, setLearningPath] =
    useState<LearningPathDetail | null>(null);

  const [progress, setProgress] =
    useState<LearningProgressSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Memuat detail learning path dan progres.
   */
  const reload = useCallback(async () => {
    if (!learningPathId) {
      setLearningPath(null);
      setProgress(null);
      setError("ID learning path tidak ditemukan.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [detail, progressData] = await Promise.all([
        getLearningPathDetail(learningPathId),
        getLearningProgress(learningPathId),
      ]);

      setLearningPath(detail);
      setProgress(progressData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat learning path."
      );
    } finally {
      setLoading(false);
    }
  }, [learningPathId]);

  /**
   * Memulai tahap belajar.
   */
  const startStep = useCallback(
    async (stepId: string): Promise<LearningPathStep> => {
      setActionLoading(true);
      setError("");

      try {
        const result = await startLearningStep(stepId);
        await reload();
        return result;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Gagal memulai tahap belajar.";

        setError(message);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [reload]
  );

  /**
   * Menyelesaikan tahap belajar.
   */
  const completeStep = useCallback(
    async (
      stepId: string
    ): Promise<{
      completedStep: LearningPathStep;
      unlockedStep: LearningPathStep | null;
    }> => {
      setActionLoading(true);
      setError("");

      try {
        const result = await completeLearningStep(stepId);
        await reload();
        return result;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Gagal menyelesaikan tahap belajar.";

        setError(message);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [reload]
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    learningPath,
    progress,
    loading,
    actionLoading,
    error,
    reload,
    startStep,
    completeStep,
  };
}
