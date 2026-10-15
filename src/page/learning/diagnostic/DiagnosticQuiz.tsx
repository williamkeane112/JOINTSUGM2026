
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";

import DiagnosticQuestion from "../../../components/learning/DiagnosticQuestion";
import QuizProgress from "../../../components/learning/QuizProgress";
import DiagnosticLoading from "./DiagnosticLoading";
import DiagnosticResult from "./DiagnosticResult";
import DashboardSidebar from "../../../components/layout/DashboardSidebar";

type QuizOption = {
  id: string;
  text: string;
};

type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  skill_key: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
};

type Assessment = {
  id: string;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  total_questions: number;
  status: string;
  created_at?: string;
};

type SkillAnalysis = {
  skill_key: string;
  correct: number;
  total: number;
  percentage: number;
  level: string;
};

type ResultData = {
  id: string;
  score: number;
  total_questions: number;
  percentage: number;
  skill_analysis: SkillAnalysis[];
  explanations: Record<string, string>;
  correct_answers: Record<string, string>;
  status: string;
  completed_at?: string;
};

type GenerateResponse = {
  assessment?: Assessment;
  resumed?: boolean;
  error?: string;
};

type SubmitResponse = {
  result?: ResultData;
  error?: string;
};

export default function DiagnosticQuiz() {
  const { id: learningGoalId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);

  const requestedGoalRef = useRef<string | null>(null);
  const submitLockRef = useRef(false);

  const loadAssessment = useCallback(async () => {
    if (!learningGoalId) {
      setLoading(false);
      setLoadingError("ID tujuan belajar tidak ditemukan.");
      return;
    }

    setLoading(true);
    setLoadingError(null);

    try {
      const { data, error } =
        await supabase.functions.invoke<GenerateResponse>(
          "diagnostic-quiz",
          {
            body: {
              action: "generate",
              learning_goal_id: learningGoalId,
            },
          },
        );

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      if (!data?.assessment) {
        throw new Error("Data assessment tidak ditemukan.");
      }

      setAssessment(data.assessment);
      setAnswers(data.assessment.answers ?? {});
      setCurrentIndex(0);
      setResult(null);
      submitLockRef.current = false;
    } catch (err) {
      setLoadingError(
        err instanceof Error
          ? err.message
          : "Gagal memuat diagnostic quiz.",
      );
    } finally {
      setLoading(false);
    }
  }, [learningGoalId]);

  useEffect(() => {
    if (requestedGoalRef.current === learningGoalId) return;

    requestedGoalRef.current = learningGoalId ?? null;
    void loadAssessment();
  }, [learningGoalId, loadAssessment]);

  const questions = assessment?.questions ?? [];
  const currentQuestion = questions[currentIndex];

  const answeredCount = questions.filter((question) =>
    Boolean(answers[question.id]),
  ).length;

  const handleSelect = (answer: string) => {
    if (!currentQuestion || submitting) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: answer,
    }));

    setSubmitError(null);
  };

  const handlePrevious = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
    setSubmitError(null);
  };

  const handleNext = () => {
    setCurrentIndex((index) =>
      Math.min(questions.length - 1, index + 1),
    );
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    if (!assessment || submitLockRef.current || submitting) return;

    const unansweredIndex = questions.findIndex(
      (question) => !answers[question.id],
    );

    if (unansweredIndex !== -1) {
      setCurrentIndex(unansweredIndex);
      setSubmitError(
        `Masih ada ${questions.length - answeredCount} soal yang belum dijawab.`,
      );
      return;
    }

    submitLockRef.current = true;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const { data, error } =
        await supabase.functions.invoke<SubmitResponse>(
          "diagnostic-quiz",
          {
            body: {
              action: "submit",
              assessment_id: assessment.id,
              answers,
            },
          },
        );

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      if (!data?.result) {
        throw new Error("Hasil diagnostic tidak ditemukan.");
      }

      setResult(data.result);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Gagal mengirim jawaban.",
      );
      submitLockRef.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DiagnosticLoading
        message="AI sedang menyusun soal sesuai tujuan belajarmu..."
      />
    );
  }

  if (loadingError || !assessment) {
    return (
      <DiagnosticLoading
        error={loadingError ?? "Assessment tidak ditemukan."}
        onRetry={() => void loadAssessment()}
      />
    );
  }

  if (result) {
    return (
      <DiagnosticResult
        result={result}
        questions={questions}
        answers={answers}
        onContinue={() =>
          navigate(`/learning-goals/${learningGoalId}`)
        }
      />
    );
  }

  if (questions.length === 0 || !currentQuestion) {
    return (
      <DiagnosticLoading
        error="Soal diagnostic kosong atau format soal tidak sesuai."
        onRetry={() => void loadAssessment()}
      />
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;
  const isCurrentAnswered = Boolean(answers[currentQuestion.id]);

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#30213F] lg:pl-[260px]">
      <DashboardSidebar studentName="Siswa" />

    <main className="min-h-screen bg-[#FFF9F0] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() =>
            navigate(`/learning-goals/${learningGoalId}`)
          }
          className="mb-7 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#81778D] transition hover:bg-white hover:text-[#7560B5]"
        >
          <span aria-hidden="true">←</span>
          Kembali ke tujuan belajar
        </button>

        <header className="mb-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EAE2F0] bg-white px-3.5 py-2 text-xs font-bold text-[#7560B5] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#F43F91]" />
            SKILLPATH AI · TES KEMAMPUAN
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#30213F] sm:text-4xl">
            Kenali kemampuan awalmu
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#81778D] sm:text-base">
            Jawab pertanyaan sesuai pemahamanmu saat ini. Hasilnya
            akan membantu SkillPath AI memahami kemampuanmu dan
            menentukan materi yang perlu dipelajari.
          </p>
        </header>

        <section className="rounded-[2rem] border border-[#EAE2F0] bg-white p-5 shadow-[0_18px_55px_rgba(48,33,63,0.06)] sm:p-8">
          <QuizProgress
            current={currentIndex + 1}
            total={questions.length}
            answered={answeredCount}
          />

          <div className="mb-7 rounded-2xl bg-[#FFF9F0] p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0EAFB] text-xl text-[#7560B5]">
                ✦
              </div>
              <div>
                <p className="text-sm font-bold text-[#30213F]">
                  Fokus pada pemahamanmu
                </p>
                <p className="mt-1 text-xs leading-5 text-[#81778D]">
                  Pilih satu jawaban yang paling sesuai.
                </p>
              </div>
            </div>
          </div>

          <DiagnosticQuestion
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            selectedAnswer={answers[currentQuestion.id]}
            onSelect={handleSelect}
          />

          {submitError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-[#F8C9D9] bg-[#FFF0F5] p-4 text-sm leading-6 text-[#A52B5B]"
            >
              {submitError}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#F0EAF3] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={currentIndex === 0 || submitting}
              onClick={handlePrevious}
              className="rounded-xl border border-[#EAE2F0] bg-white px-5 py-3 font-semibold text-[#62566F] transition hover:bg-[#FAF7FD] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Sebelumnya
            </button>

            {!isLastQuestion ? (
              <button
                type="button"
                disabled={!isCurrentAnswered || submitting}
                onClick={handleNext}
                className="rounded-xl bg-[#7560B5] px-6 py-3 font-bold text-white shadow-sm transition hover:bg-[#62509D] focus:outline-none focus:ring-4 focus:ring-[#7560B5]/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Soal Berikutnya →
              </button>
            ) : (
              <button
                type="button"
                disabled={!isCurrentAnswered || submitting}
                onClick={() => void handleSubmit()}
                className="rounded-xl bg-gradient-to-r from-[#7560B5] to-[#F43F91] px-6 py-3 font-bold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-[#7560B5]/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting
                  ? "Memeriksa jawaban..."
                  : "Selesaikan Tes ✓"}
              </button>
            )}
          </div>
        </section>

        <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-6 text-[#958BA0]">
          Jawabanmu digunakan untuk menganalisis kemampuan awal dan
          membantu proses belajar berikutnya.
        </p>
      </div>
    </main>
    </div>
  );
}
