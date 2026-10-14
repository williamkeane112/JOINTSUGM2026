
type SkillAnalysis = {
  skill_key: string;
  correct: number;
  total: number;
  percentage: number;
  level: string;
};

type QuizQuestion = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
};

type ResultData = {
  score: number;
  total_questions: number;
  percentage: number;
  skill_analysis: SkillAnalysis[];
  explanations: Record<string, string>;
  correct_answers: Record<string, string>;
};

type Props = {
  result: ResultData;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  onContinue: () => void;
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

export default function DiagnosticResult({
  result,
  questions,
  answers,
  onContinue,
}: Props) {
  const percentage = Math.max(
    0,
    Math.min(100, result.percentage ?? 0),
  );

  const message =
    percentage >= 80
      ? "Kamu sudah memiliki pemahaman awal yang kuat!"
      : percentage >= 50
      ? "Kamu sudah punya dasar. Mari tingkatkan kemampuanmu."
      : "Tidak masalah! Ini titik awal untuk perjalanan belajarmu.";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            SkillPath AI · Hasil diagnostic
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Hasil tes kemampuanmu
          </h1>
          <p className="mt-2 text-slate-600">{message}</p>
        </header>

        <section className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-7 text-white shadow-lg sm:p-10">
          <p className="text-sm font-medium text-emerald-50">
            Skor diagnostic
          </p>

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <span className="text-5xl font-extrabold sm:text-6xl">
              {percentage}%
            </span>
            <span className="mb-2 text-sm text-emerald-50">
              {result.score} dari {result.total_questions} jawaban benar
            </span>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="mt-4 text-sm leading-6 text-emerald-50">
            Hasil ini menggambarkan kemampuan awalmu, bukan batas kemampuan
            yang bisa kamu capai.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">
            Analisis kemampuan
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Gunakan hasil ini untuk mengetahui bagian yang perlu kamu latih.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {result.skill_analysis?.map((skill) => (
              <article
                key={skill.skill_key}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold capitalize text-slate-900">
                    {skill.skill_key.replace(/_/g, " ")}
                  </h3>
                  <span className="shrink-0 text-sm font-bold text-emerald-700">
                    {skill.percentage}%
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, skill.percentage),
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    {skill.correct}/{skill.total} benar
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      skill.level === "strong"
                        ? "bg-emerald-50 text-emerald-700"
                        : skill.level === "developing"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {getSkillLabel(skill.level)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">
            Pembahasan jawaban
          </h2>

          <div className="mt-4 space-y-4">
            {questions.map((question, index) => {
              const correctAnswer = result.correct_answers?.[question.id];
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === correctAnswer;

              const correctOption = question.options.find(
                (option) => option.id === correctAnswer,
              );

              return (
                <article
                  key={question.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        isCorrect
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isCorrect ? "✓" : "×"}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-6 text-slate-900">
                        {index + 1}. {question.question}
                      </p>

                      <p className="mt-3 text-sm text-slate-500">
                        Jawabanmu:{" "}
                        <span className="font-medium text-slate-700">
                          {question.options.find(
                            (option) => option.id === userAnswer,
                          )?.text ?? "Tidak dijawab"}
                        </span>
                      </p>

                      {!isCorrect && (
                        <p className="mt-2 text-sm text-emerald-700">
                          Jawaban benar:{" "}
                          {correctOption?.text ?? correctAnswer ?? "-"}
                        </p>
                      )}

                      {result.explanations?.[question.id] && (
                        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                          <span className="font-semibold text-slate-800">
                            Pembahasan:{" "}
                          </span>
                          {result.explanations[question.id]}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-8 rounded-2xl border border-emerald-100 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Siap mulai belajar?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Gunakan hasil diagnostic ini sebagai titik awal untuk menyusun
            perjalanan belajarmu.
          </p>

          <button
            onClick={onContinue}
            className="mt-5 w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
          >
            Kembali ke Tujuan Belajar →
          </button>
        </div>
      </div>
    </main>
  );
}
