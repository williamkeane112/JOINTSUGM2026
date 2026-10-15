import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  Target,
  AlertCircle,
  RefreshCw,
  Play,
} from "lucide-react";

import DashboardSidebar from "../../components/layout/DashboardSidebar";
import DiagnosticResult from "../../components/learning-goals/DiagnosticResult";
import LearningPathCard from "../../components/learning-goals/LearningPathCard";
import QuizHistory from "../../components/learning-goals/QuizHistory";

import { useLearningGoalDetail } from "../../hooks/useLearningGoalDetail";
import {
  getQuizHistory,
  type QuizHistoryAttempt,
} from "../../lib/learning-goals/quizHistoryService";

export default function LearningGoalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    goal,
    assessment,
    inProgressAssessment,
    learningPath,
    studentName,
    loading,
    error,
    pathGenerated,
    reload,
  } = useLearningGoalDetail(id);

  const [quizHistory, setQuizHistory] = useState<
    QuizHistoryAttempt[]
  >([]);

  const [quizHistoryLoading, setQuizHistoryLoading] =
    useState(true);

  const [quizHistoryError, setQuizHistoryError] = useState("");

  const loadQuizHistory = useCallback(async () => {
    if (!id) {
      setQuizHistory([]);
      setQuizHistoryLoading(false);
      setQuizHistoryError("");
      return;
    }

    setQuizHistoryLoading(true);
    setQuizHistoryError("");

    try {
      const history = await getQuizHistory(id);
      setQuizHistory(history);
    } catch (err: unknown) {
      console.error("Gagal memuat riwayat kuis:", err);

      setQuizHistoryError(
        err instanceof Error
          ? err.message
          : "Riwayat evaluasi gagal dimuat.",
      );
    } finally {
      setQuizHistoryLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      if (!id) {
        setQuizHistory([]);
        setQuizHistoryLoading(false);
        setQuizHistoryError("");
        return;
      }

      setQuizHistoryLoading(true);
      setQuizHistoryError("");

      try {
        const history = await getQuizHistory(id);

        if (!cancelled) {
          setQuizHistory(history);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          console.error("Gagal memuat riwayat kuis:", err);

          setQuizHistoryError(
            err instanceof Error
              ? err.message
              : "Riwayat evaluasi gagal dimuat.",
          );
        }
      } finally {
        if (!cancelled) {
          setQuizHistoryLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const goalTitle =
    goal?.requested_topic ??
    goal?.topic?.name ??
    goal?.title ??
    "Tujuan belajar";

  const goalDescription =
    goal?.target_outcome ??
    goal?.description ??
    "Bangun kemampuanmu melalui proses belajar yang terarah.";

  const targetLevelLabels: Record<string, string> = {
    beginner: "Pemula",
    intermediate: "Menengah",
    advanced: "Lanjutan",
  };

  const targetLevel =
    targetLevelLabels[goal?.target_level ?? ""] ??
    goal?.target_level ??
    "Belum ditentukan";

  function handleBack() {
    navigate("/topic");
  }

  function handleStartDiagnostic() {
    if (!id || pathGenerated) return;

    navigate(`/learning-goals/${id}/diagnostic`);
  }

  function handleContinueDiagnostic() {
    if (!id || !inProgressAssessment) return;

    navigate(`/learning-goals/${id}/diagnostic`, {
      state: {
        assessmentId: inProgressAssessment.id,
        resume: true,
      },
    });
  }

  function handleGeneratePath() {
    if (!id || pathGenerated || !assessment) return;

    navigate(`/learning-goals/${id}/path`);
  }

  function handleContinueLearning() {
    if (!id || !pathGenerated) return;

    navigate(`/learning-goals/${id}/path`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] lg:pl-[260px]">
        <DashboardSidebar studentName={studentName} />

        <main className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-4 w-32 animate-pulse rounded bg-[#EAE2F0]" />
          <div className="h-24 animate-pulse rounded-2xl bg-white" />
          <div className="h-36 animate-pulse rounded-2xl bg-white" />
          <div className="h-52 animate-pulse rounded-2xl bg-white" />
        </main>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] lg:pl-[260px]">
        <DashboardSidebar studentName={studentName} />

        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#7560B5]"
          >
            <ArrowLeft size={17} />
            Kembali ke topik
          </button>

          <section className="rounded-2xl border border-red-200 bg-white p-6">
            <AlertCircle size={25} className="text-red-500" />

            <h1 className="mt-3 text-lg font-bold text-[#30213F]">
              Tujuan belajar tidak dapat dimuat
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#766C80]">
              {error || "Data tujuan belajar tidak ditemukan."}
            </p>

            <button
              type="button"
              onClick={() => void reload()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#7560B5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#62509B]"
            >
              <RefreshCw size={16} />
              Coba lagi
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#29243B] lg:pl-[260px]">
      <DashboardSidebar studentName={studentName} />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#7560B5] transition hover:text-[#59458F]"
        >
          <ArrowLeft size={17} />
          Kembali ke topik
        </button>

        <header className="mb-7">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#F1EBFF] px-3 py-1 text-xs font-semibold text-[#7560B5]">
              Tujuan belajar
            </span>

            {pathGenerated && (
              <span className="rounded-full bg-[#E8F7EF] px-3 py-1 text-xs font-semibold text-[#278456]">
                Learning path tersedia
              </span>
            )}

            {inProgressAssessment && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                Kuis belum selesai
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#30213F] sm:text-3xl">
            {goalTitle}
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#766C80]">
            {goalDescription}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-[#EAE2F0] bg-white px-3 py-2 text-xs font-medium text-[#766C80]">
              <Target size={15} className="text-[#7560B5]" />
              Target: {targetLevel}
            </div>

            {goal.created_at && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#EAE2F0] bg-white px-3 py-2 text-xs font-medium text-[#766C80]">
                <Clock3 size={15} className="text-[#7560B5]" />
                Dibuat{" "}
                {new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(new Date(goal.created_at))}
              </div>
            )}
          </div>
        </header>

        <div className="space-y-5">
          {inProgressAssessment ? (
            <section className="rounded-2xl border border-amber-200 bg-white p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Play size={21} />
                </div>

                <div className="flex-1">
                  <h2 className="font-bold text-[#30213F]">
                    Lanjutkan Tes Diagnostik
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#766C80]">
                    Kamu masih memiliki tes yang belum selesai.
                    Lanjutkan untuk meneruskan progres yang tersimpan.
                  </p>

                  <button
                    type="button"
                    onClick={handleContinueDiagnostic}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#7560B5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#62509B]"
                  >
                    <Play size={16} />
                    Lanjutkan Kuis
                  </button>
                </div>
              </div>
            </section>
          ) : !assessment ? (
            <section className="rounded-2xl border border-[#EAE2F0] bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EBFF] text-[#7560B5]">
                  <BookOpen size={20} />
                </div>

                <div className="flex-1">
                  <h2 className="font-bold text-[#30213F]">
                    Tes Diagnostik
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#93879F]">
                    Kenali kemampuan awalmu untuk membantu menyusun
                    jalur belajar yang lebih sesuai.
                  </p>

                  <button
                    type="button"
                    disabled={pathGenerated}
                    onClick={handleStartDiagnostic}
                    className="mt-4 rounded-xl bg-[#7560B5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#62509B] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Mulai Tes Diagnostik
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <DiagnosticResult
              assessment={assessment}
              pathGenerated={pathGenerated}
              onRetake={
                pathGenerated ? undefined : handleStartDiagnostic
              }
            />
          )}

          {/* Riwayat evaluasi kuis */}
          <section>
            <QuizHistory
              attempts={quizHistory}
              loading={quizHistoryLoading}
            />

            {quizHistoryError && (
              <div
                role="alert"
                className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <span>{quizHistoryError}</span>

                <button
                  type="button"
                  onClick={() => void loadQuizHistory()}
                  disabled={quizHistoryLoading}
                  className="inline-flex items-center gap-2 font-semibold underline disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={
                      quizHistoryLoading ? "animate-spin" : ""
                    }
                  />
                  Coba lagi
                </button>
              </div>
            )}
          </section>

          <LearningPathCard
            learningPath={learningPath}
            pathGenerated={pathGenerated}
            hasAssessment={Boolean(assessment)}
            onGenerate={handleGeneratePath}
            onContinue={
              pathGenerated ? handleContinueLearning : undefined
            }
          />
        </div>

        <footer className="mt-10 border-t border-[#EAE2F0] py-6 text-center">
          <p className="text-xs leading-5 text-[#93879F]">
            SkillPath AI · Belajar sesuai kemampuanmu, berkembang setiap hari.
          </p>
        </footer>
      </main>
    </div>
  );
}
