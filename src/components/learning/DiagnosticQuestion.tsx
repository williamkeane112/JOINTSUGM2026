
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

type Props = {
  question: QuizQuestion;
  selectedAnswer?: string;
  questionNumber: number;
  onSelect: (answer: string) => void;
};

export default function DiagnosticQuestion({
  question,
  selectedAnswer,
  questionNumber,
  onSelect,
}: Props) {
  return (
    <section className="w-full">
      <div className="mb-5 flex items-center gap-2">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          Soal {questionNumber}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm capitalize text-slate-600">
          {question.difficulty_level}
        </span>
      </div>

      <h2 className="mb-7 text-xl font-bold leading-relaxed text-slate-900 sm:text-2xl">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={isSelected}
              className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition duration-200 ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                  : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                  isSelected
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {option.id}
              </span>

              <span className="flex-1 pt-1 text-sm leading-6 text-slate-700 sm:text-base">
                {option.text}
              </span>

              {isSelected && (
                <span className="pt-1 font-bold text-emerald-600">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
