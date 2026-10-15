
import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Clock3,
  History,
  X,
} from "lucide-react";

import type {
  QuizHistoryAnswer,
  QuizHistoryAttempt,
} from "../../lib/learning-goals/quizHistoryService";

interface QuizHistoryProps {
  attempts: QuizHistoryAttempt[];
  loading?: boolean;
}

interface AnswerCardProps {
  answer: QuizHistoryAnswer;
  index: number;
}

interface AnswerStats {
  correct: number;
  incorrect: number;
  unevaluated: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getPercentage(
  score: number | null,
  totalQuestions: number
): number | null {
  if (
    score === null ||
    totalQuestions <= 0 ||
    !Number.isFinite(score)
  ) {
    return null;
  }

  return Math.round((score / totalQuestions) * 100);
}

function getScoreLabel(score: number | null): string {
  if (score === null) {
    return "Belum tersedia";
  }

  return `${score} benar`;
}

function getScoreColor(percentage: number | null): string {
  if (percentage === null) {
    return "text-gray-500 bg-gray-100";
  }

  if (percentage >= 80) {
    return "text-emerald-700 bg-emerald-50";
  }

  if (percentage >= 60) {
    return "text-amber-700 bg-amber-50";
  }

  return "text-rose-700 bg-rose-50";
}

/**
 * Menghitung statistik evaluasi dari jawaban yang sudah dipetakan
 * oleh quizHistoryService.
 *
 * Nilai null atau undefined dihitung sebagai belum dievaluasi.
 * Fungsi ini tidak mengarang hasil evaluasi dari skor.
 */
function getAnswerStats(
  answers: QuizHistoryAnswer[]
): AnswerStats {
  return answers.reduce<AnswerStats>(
    (stats, answer) => {
      if (answer.isCorrect === true) {
        stats.correct += 1;
      } else if (answer.isCorrect === false) {
        stats.incorrect += 1;
      } else {
        stats.unevaluated += 1;
      }

      return stats;
    },
    {
      correct: 0,
      incorrect: 0,
      unevaluated: 0,
    }
  );
}

function AnswerCard({
  answer,
  index,
}: AnswerCardProps) {
  const [showExplanation, setShowExplanation] =
    useState(true);

  const evaluated =
    typeof answer.isCorrect === "boolean";

  const isCorrect = answer.isCorrect === true;

  return (
    <article className="rounded-2xl border border-[#E8DFF2] bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0EAFB] text-sm font-bold text-[#7560B5]">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold leading-7 text-[#30213F] sm:text-base">
            {answer.question}
          </h4>

          <div className="mt-3">
            {evaluated ? (
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isCorrect
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <CircleAlert size={15} />
                )}

                {isCorrect
                  ? "Jawaban benar"
                  : "Jawaban salah"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                <CircleAlert size={15} />
                Belum dievaluasi
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3 pl-0 sm:pl-[52px]">
        <div className="rounded-2xl bg-[#FAF7FC] p-4">
          <p className="mb-1.5 text-xs font-semibold text-gray-500">
            Jawaban kamu
          </p>

          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#30213F] sm:text-base">
            {answer.selectedAnswer ?? "Tidak ada jawaban"}
          </p>
        </div>

        {evaluated && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <p className="mb-1.5 text-xs font-semibold text-emerald-700">
              Jawaban benar
            </p>

            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-emerald-900 sm:text-base">
              {answer.correctAnswer ??
                (isCorrect
                  ? answer.selectedAnswer
                  : "Kunci jawaban tidak tersedia") ??
                "-"}
            </p>
          </div>
        )}

        {answer.explanation && (
          <div className="overflow-hidden rounded-2xl border border-[#E8DFF2]">
            <button
              type="button"
              onClick={() =>
                setShowExplanation((current) => !current)
              }
              className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3 text-left transition hover:bg-[#FAF7FC]"
              aria-expanded={showExplanation}
            >
              <span className="text-sm font-semibold text-[#7560B5]">
                Pembahasan
              </span>

              {showExplanation ? (
                <ChevronUp
                  size={18}
                  className="shrink-0 text-[#7560B5]"
                />
              ) : (
                <ChevronDown
                  size={18}
                  className="shrink-0 text-[#7560B5]"
                />
              )}
            </button>

            {showExplanation && (
              <div className="border-t border-[#E8DFF2] bg-[#FAF7FC] px-4 py-3">
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
                  {answer.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

interface AttemptReviewProps {
  attempt: QuizHistoryAttempt;
  onClose: () => void;
}

function AttemptReview({
  attempt,
  onClose,
}: AttemptReviewProps) {
  const {
    correct,
    incorrect,
    unevaluated,
  } = getAnswerStats(attempt.answers);

  const percentage = getPercentage(
    attempt.score,
    attempt.totalQuestions
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#30213F]/50 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-review-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-[#FFF9F0] shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#E8DFF2] bg-white p-5 sm:p-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#7560B5]">
              <BookOpen size={17} />
              Evaluasi pembelajaran
            </div>

            <h2
              id="quiz-review-title"
              className="text-xl font-bold text-[#30213F] sm:text-2xl"
            >
              Review jawaban kuis
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {formatDate(attempt.completedAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup review"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-[#30213F]"
          >
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto p-4 sm:p-6">
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-[#E8DFF2] bg-white p-4">
              <p className="text-xs text-gray-500">
                Skor
              </p>

              <p className="mt-2 text-2xl font-bold text-[#7560B5]">
                {percentage === null
                  ? "-"
                  : `${percentage}%`}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-4">
              <p className="text-xs text-gray-500">
                Benar
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {correct}
              </p>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-white p-4">
              <p className="text-xs text-gray-500">
                Salah
              </p>

              <p className="mt-2 text-2xl font-bold text-rose-600">
                {incorrect}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-white p-4">
              <p className="text-xs text-gray-500">
                Belum dievaluasi
              </p>

              <p className="mt-2 text-2xl font-bold text-amber-600">
                {unevaluated}
              </p>
            </div>
          </div>

          {unevaluated > 0 && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <CircleAlert
                size={20}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Beberapa jawaban belum dievaluasi
                </p>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Kunci jawaban untuk beberapa soal belum
                  berhasil dibaca. Periksa pemetaan jawaban
                  dan kunci jawaban di Supabase.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {attempt.answers.length > 0 ? (
              attempt.answers.map((answer, index) => (
                <AnswerCard
                  key={`${attempt.id}-${index}`}
                  answer={answer}
                  index={index}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#D9CBEA] bg-white p-8 text-center">
                <BookOpen
                  size={32}
                  className="mx-auto text-[#B6A5D7]"
                />

                <p className="mt-3 font-semibold text-[#30213F]">
                  Detail jawaban belum tersedia
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Tidak ada jawaban yang dapat ditampilkan
                  untuk percobaan ini.
                </p>
              </div>
            )}
          </div>
        </div>

        <footer className="border-t border-[#E8DFF2] bg-white p-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#7560B5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6550A5]"
          >
            Tutup evaluasi
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function QuizHistory({
  attempts,
  loading = false,
}: QuizHistoryProps) {
  const [selectedAttempt, setSelectedAttempt] =
    useState<QuizHistoryAttempt | null>(null);

  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <section className="rounded-3xl border border-[#E8DFF2] bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0EAFB]">
            <History
              size={22}
              className="text-[#7560B5]"
            />
          </div>

          <div>
            <h3 className="font-bold text-[#30213F]">
              Riwayat kuis
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Memuat riwayat evaluasi...
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl bg-[#F7F3FA]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (attempts.length === 0) {
    return (
      <section className="rounded-3xl border border-[#E8DFF2] bg-white p-6 sm:p-8">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EAFB]">
            <History
              size={27}
              className="text-[#7560B5]"
            />
          </div>

          <h3 className="mt-4 text-lg font-bold text-[#30213F]">
            Belum ada riwayat kuis
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Selesaikan asesmen untuk melihat riwayat
            percobaan, skor, dan evaluasi jawaban kamu di sini.
          </p>
        </div>
      </section>
    );
  }

  const visibleAttempts = showAll
    ? attempts
    : attempts.slice(0, 3);

  return (
    <>
      <section className="rounded-3xl border border-[#E8DFF2] bg-white p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F0EAFB]">
              <History
                size={22}
                className="text-[#7560B5]"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#30213F]">
                Riwayat kuis
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {attempts.length} percobaan tersimpan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full bg-[#F5F0FB] px-3 py-2 text-xs font-semibold text-[#7560B5] sm:self-center">
            <Clock3 size={15} />
            Evaluasi pembelajaran
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {visibleAttempts.map((attempt, index) => {
            const percentage = getPercentage(
              attempt.score,
              attempt.totalQuestions
            );

            const {
              correct,
              incorrect,
              unevaluated,
            } = getAnswerStats(attempt.answers);

            return (
              <article
                key={attempt.id}
                className="rounded-2xl border border-[#E8DFF2] p-4 transition hover:border-[#CBBCE6] hover:shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0EAFB] text-sm font-bold text-[#7560B5]">
                      {attempts.length - index}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-semibold text-[#30213F]">
                        {attempt.title ||
                          `Percobaan kuis ${
                            attempts.length - index
                          }`}
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {formatDate(attempt.completedAt)}
                      </p>

                      <p className="mt-2 text-sm text-gray-600">
                        {getScoreLabel(attempt.score)}
                        {" dari "}
                        {attempt.totalQuestions} soal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <div
                      className={`rounded-xl px-3 py-2 text-center ${getScoreColor(
                        percentage
                      )}`}
                    >
                      <p className="text-lg font-bold">
                        {percentage === null
                          ? "-"
                          : `${percentage}%`}
                      </p>

                      <p className="text-[10px] font-medium">
                        Skor
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAttempt(attempt)
                      }
                      className="rounded-xl bg-[#7560B5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6550A5]"
                    >
                      Review
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-[#F0EAF5] pt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                    <CheckCircle2 size={14} />
                    {correct} benar
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700">
                    <CircleAlert size={14} />
                    {incorrect} salah
                  </span>

                  {unevaluated > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                      <Clock3 size={14} />
                      {unevaluated} belum dievaluasi
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {attempts.length > 3 && (
          <button
            type="button"
            onClick={() =>
              setShowAll((current) => !current)
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E8DFF2] px-4 py-3 text-sm font-semibold text-[#7560B5] transition hover:bg-[#FAF7FC]"
          >
            {showAll ? (
              <>
                <ChevronUp size={17} />
                Tampilkan lebih sedikit
              </>
            ) : (
              <>
                <ChevronDown size={17} />
                Lihat semua riwayat ({attempts.length})
              </>
            )}
          </button>
        )}
      </section>

      {selectedAttempt && (
        <AttemptReview
          attempt={selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
        />
      )}
    </>
  );
}
