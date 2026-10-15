import DashboardSidebar from "../../../components/layout/DashboardSidebar";


type SkillAnalysis = {
  skill_key: string;
  correct: number;
  total: number;
  percentage: number;
  level: string;
};

type QuizOption = {
  id: string;
  text: string;
};

type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
};

type ResultData = {
  id?: string;
  score: number;
  total_questions: number;
  percentage: number;
  skill_analysis: SkillAnalysis[];
  explanations: Record<string, string>;
  correct_answers: Record<string, string>;
  status?: string;
  completed_at?: string;
};

type Props = {
  result: ResultData;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  onContinue: () => void;
  studentName?: string;
};

function getSkillLabel(level: string) {
  switch (level) {
    case "strong":
      return "Kuat";
    case "developing":
      return "Berkembang";
    case "needs_improvement":
      return "Perlu dipelajari";
    default:
      return level;
  }
}

function getSkillStyle(level: string) {
  switch (level) {
    case "strong":
      return "bg-[#E8F7EF] text-[#267A50]";
    case "developing":
      return "bg-[#FFF1DB] text-[#A66A16]";
    case "needs_improvement":
      return "bg-[#FFF0F5] text-[#C23570]";
    default:
      return "bg-[#F0EAFB] text-[#7560B5]";
  }
}

export default function DiagnosticResult({
  result,
  questions,
  answers,
  onContinue,
  studentName = "Pelajar",
}: Props) {
  const percentage = Math.max(
    0,
    Math.min(100, Number(result.percentage) || 0),
  );

  const message =
    percentage >= 80
      ? "Kamu sudah memiliki pemahaman awal yang kuat!"
      : percentage >= 50
        ? "Kamu sudah punya dasar. Mari tingkatkan kemampuanmu."
        : "Tidak masalah! Ini titik awal untuk perjalanan belajarmu.";

  const skills = result.skill_analysis ?? [];

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#29243B] lg:pl-[260px]">
      <DashboardSidebar studentName={studentName} />

      <main className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EAE2F0] bg-white px-3.5 py-2 text-xs font-bold text-[#7560B5]">
            <span className="h-2 w-2 rounded-full bg-[#F43F91]" />
            SKILLPATH AI · HASIL DIAGNOSTIK
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#30213F] sm:text-4xl">
            Hasil tes kemampuanmu
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#81778D] sm:text-base">
            {message}
          </p>
        </header>

        {/* Skor utama */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#7560B5] via-[#6550A0] to-[#30213F] p-7 text-white shadow-[0_20px_60px_rgba(48,33,63,0.18)] sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[35px] border-white/5"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-[#F43F91]/10 blur-2xl"
          />

          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white/75">
                  Skor diagnostik
                </p>
                <p className="mt-2 text-sm text-white/60">
                  Gambaran kemampuan awalmu
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl">
                ✦
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-end gap-3">
              <span className="text-6xl font-extrabold tracking-tight sm:text-7xl">
                {percentage}%
              </span>

              <span className="mb-2 text-sm text-white/75">
                {result.score} dari {result.total_questions} jawaban benar
              </span>
            </div>

            <div
              className="mt-7 h-3 overflow-hidden rounded-full bg-white/15"
              role="progressbar"
              aria-label="Skor diagnostik"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percentage}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-white to-[#FBC5DF] transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <p className="mt-5 max-w-xl text-sm leading-6 text-white/75">
              Hasil ini menggambarkan kemampuan awalmu, bukan batas
              kemampuan yang bisa kamu capai. Terus belajar dan
              tingkatkan kemampuanmu secara bertahap.
            </p>
          </div>
        </section>

        {/* Analisis kemampuan */}
        <section className="mt-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7560B5]">
              Ringkasan kemampuan
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-[#30213F]">
              Analisis kemampuan
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#81778D]">
              Kenali skill yang sudah kamu kuasai dan bagian yang masih
              perlu dilatih.
            </p>
          </div>

          {skills.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {skills.map((skill) => {
                const skillPercentage = Math.max(
                  0,
                  Math.min(100, Number(skill.percentage) || 0),
                );

                return (
                  <article
                    key={skill.skill_key}
                    className="rounded-xl border border-[#EAE2F0] bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="min-w-0 truncate text-sm font-bold capitalize text-[#30213F]">
                        {skill.skill_key.replace(/_/g, " ")}
                      </h3>
                      <span className="shrink-0 text-lg font-bold text-[#7560B5]">
                        {skillPercentage}%
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <p className="text-xs text-[#958BA0]">
                        {skill.correct}/{skill.total} soal benar
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getSkillStyle(skill.level)}`}
                      >
                        {getSkillLabel(skill.level)}
                      </span>
                    </div>

                    <div
                      className="mt-3 h-2 overflow-hidden rounded-full bg-[#F0EAF3]"
                      role="progressbar"
                      aria-label={`Progres ${skill.skill_key}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={skillPercentage}
                    >
                      <div
                        className="h-full rounded-full bg-[#8B70C8] transition-all duration-500"
                        style={{ width: `${skillPercentage}%` }}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-[#EAE2F0] bg-white p-6 text-sm text-[#81778D]">
              Analisis per skill belum tersedia untuk hasil ini.
            </div>
          )}
        </section>

        {/* Pembahasan soal */}
        <section className="mt-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7560B5]">
              Evaluasi jawaban
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-[#30213F]">
              Pembahasan jawaban
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#81778D]">
              Pelajari kembali setiap jawaban untuk memahami materi
              yang sudah dikuasai dan yang perlu ditingkatkan.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {questions.map((question, index) => {
              const correctAnswer =
                result.correct_answers?.[question.id];

              const userAnswer = answers[question.id];

              const isCorrect =
                correctAnswer !== undefined &&
                userAnswer === correctAnswer;

              const correctOption = question.options.find(
                (option) => option.id === correctAnswer,
              );

              const userOption = question.options.find(
                (option) => option.id === userAnswer,
              );

              return (
                <article
                  key={question.id}
                  className="rounded-2xl border border-[#EAE2F0] bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base font-extrabold ${
                        isCorrect
                          ? "bg-[#E8F7EF] text-[#267A50]"
                          : "bg-[#FFF0F5] text-[#C23570]"
                      }`}
                      aria-label={
                        isCorrect ? "Jawaban benar" : "Jawaban salah"
                      }
                    >
                      {isCorrect ? "✓" : "×"}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#958BA0]">
                          Pertanyaan {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            isCorrect
                              ? "bg-[#E8F7EF] text-[#267A50]"
                              : "bg-[#FFF0F5] text-[#C23570]"
                          }`}
                        >
                          {isCorrect ? "Benar" : "Perlu ditinjau"}
                        </span>
                      </div>

                      <h3 className="mt-3 font-bold leading-7 text-[#30213F]">
                        {question.question}
                      </h3>

                      <div className="mt-4 space-y-3">
                        <div className="rounded-xl bg-[#FFF9F0] p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#958BA0]">
                            Jawabanmu
                          </p>

                          <p className="mt-1.5 text-sm leading-6 text-[#62566F]">
                            {userOption?.text ?? "Tidak dijawab"}
                          </p>
                        </div>

                        {!isCorrect && (
                          <div className="rounded-xl border border-[#DCD2F1] bg-[#F7F3FF] p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#7560B5]">
                              Jawaban yang benar
                            </p>

                            <p className="mt-1.5 text-sm font-semibold leading-6 text-[#30213F]">
                              {correctOption?.text ??
                                correctAnswer ??
                                "Belum tersedia"}
                            </p>
                          </div>
                        )}

                        {result.explanations?.[question.id] && (
                          <div className="rounded-xl border border-[#EAE2F0] p-4">
                            <p className="flex items-center gap-2 text-sm font-bold text-[#30213F]">
                              <span className="text-[#F43F91]">✦</span>
                              Pembahasan
                            </p>

                            <p className="mt-2 text-sm leading-7 text-[#62566F]">
                              {result.explanations[question.id]}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10 overflow-hidden rounded-[2rem] border border-[#EAE2F0] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F0EAFB] text-2xl text-[#7560B5]">
              ✦
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-[#30213F]">
                Siap melanjutkan perjalanan belajar?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#81778D]">
                Gunakan hasil diagnostik ini sebagai titik awal untuk
                melanjutkan materi dan mengembangkan kemampuanmu.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#7560B5] to-[#F43F91] px-6 py-3.5 font-bold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-[#7560B5]/20 sm:w-auto"
          >
            Kembali ke Tujuan Belajar →
          </button>
        </section>

        <p className="mt-6 text-center text-xs leading-6 text-[#958BA0]">
          SkillPath AI · Belajar sesuai kemampuan dan ritmemu.
        </p>
        </div>
      </main>
    </div>
  );
}
