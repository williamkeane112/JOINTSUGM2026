
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CircleHelp,
  LoaderCircle,
  RefreshCw,
  Send,
  Trophy,
} from "lucide-react";

import DashboardSidebar from "../../components/layout/DashboardSidebar";
import { supabase } from "../../lib/supabaseClient";
import {
  generateCheckpointQuiz,
  submitCheckpointQuiz,
  type CheckpointQuestion,
  type CheckpointSession,
} from "../../lib/learningpath/checkpointQuizService";

type ReviewItem = {
  question?: string;
  question_text?: string;
  student_answer?: string;
  answer?: string;
  correct_answer?: string;
  explanation?: string;
  is_correct?: boolean;
};

type QuizResult = {
  score?: number;
  correct_count?: number;
  question_count?: number;
  passing_score?: number;
  status?: string;
  passed?: boolean;
  review?: ReviewItem[];
  results?: ReviewItem[];
  message?: string;
};

type NormalizedOption = {
  value: string;
  label: string;
};

/**
 * Menormalkan beberapa kemungkinan format options dari AI/backend:
 *
 * ["HTML", "CSS", "JavaScript", "React"]
 *
 * [{ value: "A", label: "HTML" }, ...]
 *
 * { A: "HTML", B: "CSS", C: "JavaScript", D: "React" }
 *
 * { A: { text: "HTML" }, ... }
 */
function getOptions(question: CheckpointQuestion): NormalizedOption[] {
  const rawOptions: unknown = question.options;

  if (Array.isArray(rawOptions)) {
    return rawOptions
      .map((option, index): NormalizedOption | null => {
        const defaultValue = String.fromCharCode(65 + index);

        if (typeof option === "string" || typeof option === "number") {
          const label = String(option).trim();

          if (!label) return null;

          return {
            value: defaultValue,
            label,
          };
        }

        if (option && typeof option === "object") {
          const item = option as Record<string, unknown>;

          const rawLabel =
            item.label ??
            item.text ??
            item.option_text ??
            item.option ??
            item.value;

          if (
            typeof rawLabel !== "string" &&
            typeof rawLabel !== "number"
          ) {
            return null;
          }

          const label = String(rawLabel).trim();

          if (!label) return null;

          // Untuk array pilihan, gunakan huruf A/B/C/D secara konsisten.
          return {
            value: defaultValue,
            label,
          };
        }

        return null;
      })
      .filter((option): option is NormalizedOption => option !== null);
  }

  if (rawOptions && typeof rawOptions === "object") {
    return Object.entries(rawOptions as Record<string, unknown>)
      .map(([key, rawValue]): NormalizedOption | null => {
        let label: string;

        if (
          typeof rawValue === "string" ||
          typeof rawValue === "number"
        ) {
          label = String(rawValue).trim();
        } else if (rawValue && typeof rawValue === "object") {
          const item = rawValue as Record<string, unknown>;
          const textValue =
            item.label ??
            item.text ??
            item.option_text ??
            item.option ??
            item.value;

          if (
            typeof textValue !== "string" &&
            typeof textValue !== "number"
          ) {
            return null;
          }

          label = String(textValue).trim();
        } else {
          return null;
        }

        if (!label) return null;

        return {
          value: key,
          label,
        };
      })
      .filter((option): option is NormalizedOption => option !== null);
  }

  return [];
}

export default function CheckpointQuizPage() {
  const { id: learningPathId, checkpointNumber: checkpointParam } =
    useParams<{ id: string; checkpointNumber: string }>();

  const navigate = useNavigate();
  const checkpointNumber = Number(checkpointParam);

  const [studentName, setStudentName] = useState("Siswa");

  const [quiz, setQuiz] = useState<{
    session: CheckpointSession;
    questions: CheckpointQuestion[];
  } | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startedAt, setStartedAt] = useState(() => Date.now());

  const loadQuiz = useCallback(async () => {
    if (
      !learningPathId ||
      !Number.isInteger(checkpointNumber) ||
      checkpointNumber < 1
    ) {
      setError("Alamat checkpoint tidak valid.");
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
        throw new Error("Silakan login untuk mengerjakan checkpoint.");
      }

      setStudentName(
        user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.email?.split("@")[0] ??
          "Siswa",
      );

      const generated = await generateCheckpointQuiz(
        learningPathId,
        checkpointNumber,
      );

      if (!generated?.session || !Array.isArray(generated.questions)) {
        throw new Error(
          "Format respons checkpoint tidak valid. Periksa checkpointQuizService.ts.",
        );
      }

      if (generated.session.status === "passed") {
        navigate(`/learning-path/${learningPathId}`, {
          replace: true,
        });
        return;
      }

      if (generated.questions.length === 0) {
        throw new Error("Belum ada soal yang berhasil dibuat.");
      }

      const invalidQuestion = generated.questions.find(
        (question) =>
          !question.question_text?.trim() ||
          getOptions(question).length < 2,
      );

      if (invalidQuestion) {
        console.error(
          "Data soal checkpoint tidak valid:",
          invalidQuestion,
        );

        throw new Error(
          "Sebagian soal atau pilihan jawabannya kosong. Periksa format options dari Edge Function generate-checkpoint-quiz.",
        );
      }

      setQuiz(generated);
      setAnswers({});
      setResult(null);
      setStartedAt(Date.now());
    } catch (err) {
      console.error("Gagal memuat checkpoint:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat checkpoint.",
      );
    } finally {
      setLoading(false);
    }
  }, [learningPathId, checkpointNumber, navigate]);

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  const answeredCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers],
  );

  async function handleSubmit() {
    if (!quiz || submitting || result) return;

    if (answeredCount !== quiz.questions.length) {
      setError(
        `Jawab semua soal terlebih dahulu. ${answeredCount} dari ${quiz.questions.length} soal telah dijawab.`,
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        session_id: quiz.session.id,
        answers: quiz.questions.map((question) => {
          const questionId =
            question.session_question_id ?? question.id;

          return {
            session_question_id: questionId,
            answer: answers[questionId],
            response_time_ms: Math.max(0, Date.now() - startedAt),
          };
        }),
      };

      const response = await submitCheckpointQuiz(payload);

      const responseResult =
        (response.result as QuizResult | undefined) ??
        (response as QuizResult);

      setResult(responseResult);
    } catch (err) {
      console.error("Gagal mengumpulkan checkpoint:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Jawaban gagal dikumpulkan. Silakan coba kembali.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const score = Number(result?.score ?? 0);

  const passingScore = Number(
    result?.passing_score ?? quiz?.session.passing_score ?? 70,
  );

  const passed =
    result?.passed ??
    (result?.status === "passed" || score >= passingScore);

  const review = result?.review ?? result?.results ?? [];

  return (
    <div className="min-h-screen bg-[#fbf9fe] text-[#29243b]">
      <DashboardSidebar studentName={studentName} />

      <main className="min-h-screen min-w-0 px-4 py-6 sm:px-6 lg:ml-[260px] lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            to={`/learning-path/${learningPathId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#7653c5] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke learning path
          </Link>

          <header className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#6f49bc] via-[#815bd0] to-[#a28ae2] p-6 text-white shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
                  SKILLPATH AI · CHECKPOINT
                </span>

                <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                  Evaluasi Pembelajaran {checkpointNumber}
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">
                  Uji pemahamanmu dari materi sebelumnya. Jawab semua soal
                  untuk membuka tahap pembelajaran berikutnya.
                </p>
              </div>

              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
                <CircleHelp className="h-7 w-7" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-xs text-white/75">Jumlah soal</p>
                <p className="mt-1 text-xl font-bold">
                  {quiz?.questions.length ?? 10}
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-xs text-white/75">Nilai minimum</p>
                <p className="mt-1 text-xl font-bold">{passingScore}%</p>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-xs text-white/75">Terjawab</p>
                <p className="mt-1 text-xl font-bold">
                  {answeredCount}/{quiz?.questions.length ?? 10}
                </p>
              </div>
            </div>
          </header>

          {loading && (
            <div className="mt-6 rounded-2xl border border-[#eee8f8] bg-white p-12 text-center">
              <LoaderCircle className="mx-auto h-9 w-9 animate-spin text-[#7956c8]" />
              <p className="mt-4 font-semibold">
                Menyiapkan soal checkpoint...
              </p>
              <p className="mt-1 text-sm text-gray-500">
                AI sedang menyusun evaluasi berdasarkan materi belajarmu.
              </p>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div className="flex-1">{error}</div>

              {!result && (
                <button
                  type="button"
                  onClick={() => void loadQuiz()}
                  disabled={loading}
                  className="inline-flex shrink-0 items-center gap-1 font-semibold disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Coba lagi
                </button>
              )}
            </div>
          )}

          {!loading && quiz && !result && (
            <div className="mt-6 space-y-4">
              {quiz.questions.map((question, index) => {
                const questionId =
                  question.session_question_id ?? question.id;

                const options = getOptions(question);

                return (
                  <section
                    key={questionId}
                    className="rounded-2xl border border-[#eee8f8] bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0eaff] text-sm font-extrabold text-[#7956c8]">
                        {index + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-7 text-[#342a4b]">
                          {question.question_text}
                        </p>

                        {question.skill_key && (
                          <p className="mt-1 text-xs text-[#8b819d]">
                            Materi: {question.skill_key}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:pl-12">
                      {options.map((option, optionIndex) => {
                        const selected =
                          answers[questionId] === option.value;

                        return (
                          <button
                            key={`${questionId}-option-${optionIndex}-${option.value}`}
                            type="button"
                            disabled={submitting}
                            aria-pressed={selected}
                            onClick={() => {
                              setAnswers((previous) => ({
                                ...previous,
                                [questionId]: option.value,
                              }));
                              setError("");
                            }}
                            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                              selected
                                ? "border-[#8863d4] bg-[#f5f0ff] ring-2 ring-[#8863d4]/15"
                                : "border-[#e9e3f2] bg-white hover:border-[#c7b5e9] hover:bg-[#fcfaff]"
                            }`}
                          >
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                selected
                                  ? "bg-[#7956c8] text-white"
                                  : "bg-[#f2eef8] text-[#655879]"
                              }`}
                            >
                              {String.fromCharCode(65 + optionIndex)}
                            </span>

                            <span className="min-w-0 flex-1 break-words pt-0.5 text-sm leading-6 text-[#51465f]">
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}

              <div className="sticky bottom-3 rounded-2xl border border-[#eee8f8] bg-white/95 p-4 shadow-lg backdrop-blur sm:flex sm:items-center sm:justify-between">
                <div className="mb-3 sm:mb-0">
                  <p className="text-sm font-bold text-[#342a4b]">
                    {answeredCount} dari {quiz.questions.length} soal terjawab
                  </p>

                  <p className="mt-1 text-xs text-[#898197]">
                    Pastikan semua jawaban sudah dipilih sebelum dikumpulkan.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    submitting ||
                    answeredCount !== quiz.questions.length
                  }
                  onClick={() => void handleSubmit()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7956c8] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6845b8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {submitting ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}

                  {submitting
                    ? "Memeriksa jawaban..."
                    : "Kumpulkan jawaban"}
                </button>
              </div>
            </div>
          )}

          {result && (
            <section className="mt-6 rounded-3xl border border-[#eee8f8] bg-white p-6 shadow-sm sm:p-8">
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
                  passed
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {passed ? (
                  <Trophy className="h-8 w-8" />
                ) : (
                  <AlertCircle className="h-8 w-8" />
                )}
              </div>

              <h2 className="mt-4 text-center text-2xl font-extrabold text-[#342a4b]">
                {passed
                  ? "Checkpoint berhasil!"
                  : "Belum lulus checkpoint"}
              </h2>

              <p className="mt-2 text-center text-sm leading-6 text-[#898197]">
                {passed
                  ? "Bagus! Kamu memenuhi nilai minimum dan dapat melanjutkan pembelajaran."
                  : `Nilai minimum adalah ${passingScore}%. Pelajari pembahasan, lalu coba lagi.`}
              </p>

              <div className="mt-6 rounded-2xl bg-[#f8f5ff] p-6 text-center">
                <p className="text-sm font-medium text-[#766a8e]">
                  Nilai kamu
                </p>

                <p className="mt-1 text-5xl font-extrabold text-[#7956c8]">
                  {score}%
                </p>

                <p className="mt-2 text-xs text-[#898197]">
                  {result.correct_count ?? "—"} dari{" "}
                  {result.question_count ?? quiz?.questions.length ?? 10}{" "}
                  jawaban benar
                </p>
              </div>

              {review.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="font-bold text-[#342a4b]">
                    Pembahasan jawaban
                  </h3>

                  {review.map((item, index) => (
                    <div
                      key={`review-${index}`}
                      className="rounded-xl border border-[#eee8f8] p-4"
                    >
                      <div className="flex items-start gap-2">
                        {item.is_correct ? (
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                        ) : (
                          <AlertCircle className="mt-1 h-4 w-4 shrink-0 text-red-500" />
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[#342a4b]">
                            {item.question_text ??
                              item.question ??
                              `Soal ${index + 1}`}
                          </p>

                          {item.correct_answer && (
                            <p className="mt-2 break-words text-sm text-[#655879]">
                              Jawaban benar: {item.correct_answer}
                            </p>
                          )}

                          {item.explanation && (
                            <p className="mt-2 text-sm leading-6 text-[#898197]">
                              {item.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                {passed ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/learning-path/${learningPathId}`, {
                        replace: true,
                      })
                    }
                    className="rounded-xl bg-[#7956c8] px-6 py-3 text-sm font-bold text-white hover:bg-[#6845b8]"
                  >
                    Lanjutkan pembelajaran
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void loadQuiz()}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7956c8] px-6 py-3 text-sm font-bold text-white hover:bg-[#6845b8] disabled:opacity-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Coba checkpoint lagi
                  </button>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
