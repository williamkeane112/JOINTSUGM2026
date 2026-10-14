
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";

import DiagnosticQuestion from "../../../components/learning/DiagnosticQuestion";
import QuizProgress from "../../../components/learning/QuizProgress";
import DiagnosticLoading from "./DiagnosticLoading";
import DiagnosticResult from "./DiagnosticResult";

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

  // Mencegah pemanggilan generate berulang pada efek React StrictMode.
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

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.assessment) {
        throw new Error("Data assessment tidak ditemukan.");
      }

      setAssessment(data.assessment);
      setAnswers(data.assessment.answers ?? {});
      setCurrentIndex(0);
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
    if (!learningGoalId) {
      void loadAssessment();
      return;
    }

    if (requestedGoalRef.current === learningGoalId) {
      return;
    }

    requestedGoalRef.current = learningGoalId;
    void loadAssessment();
  }, [learningGoalId, loadAssessment]);

  const questions = assessment?.questions ?? [];
  const currentQuestion = questions[currentIndex];

  const answeredCount = questions.filter(
    (question) => Boolean(answers[question.id]),
  ).length;

  const handleSelect = (answer: string) => {
    if (!currentQuestion || submitting) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: answer,
    }));

    setSubmitError(null);
  };

  const handleSubmit = async () => {
    if (!assessment || submitLockRef.current) return;

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

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

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
      <DiagnosticLoading message="Gemini AI sedang menyusun soal sesuai tujuan belajarmu..." />
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

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(`/learning-goals/${learningGoalId}`)}
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
        >
          <span aria-hidden="true">←</span>
          Kembali ke tujuan belajar
        </button>

        <header className="mb-7">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            AI Learning Assessment
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Kenali kemampuan awalmu
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Jawab pertanyaan berikut sesuai pemahamanmu saat ini.
            Hasilnya akan membantu menentukan bagian yang perlu kamu pelajari.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <QuizProgress
            current={currentIndex + 1}
            total={questions.length}
            answered={answeredCount}
          />

          <DiagnosticQuestion
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            selectedAnswer={answers[currentQuestion.id]}
            onSelect={handleSelect}
          />

          {submitError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
            >
              {submitError}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={currentIndex === 0 || submitting}
              onClick={() => {
                setCurrentIndex((index) => Math.max(0, index - 1));
                setSubmitError(null);
              }}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Sebelumnya
            </button>

            <div className="flex flex-col gap-2 sm:flex-row">
              {!isLastQuestion ? (
                <button
                  type="button"
                  disabled={
                    !answers[currentQuestion.id] || submitting
                  }
                  onClick={() => {
                    setCurrentIndex((index) =>
                      Math.min(questions.length - 1, index + 1),
                    );
                    setSubmitError(null);
                  }}
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Soal Berikutnya →
                </button>
              ) : (
                <button
                  type="button"
                  disabled={
                    !answers[currentQuestion.id] || submitting
                  }
                  onClick={() => void handleSubmit()}
                  className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting
                    ? "Memeriksa jawaban..."
                    : "Selesaikan Diagnostic ✓"}
                </button>
              )}
            </div>
          </div>
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          Jawabanmu digunakan untuk menganalisis kemampuan awal dan
          membantu proses belajar berikutnya.
        </p>
      </div>
    </main>
  );
}
