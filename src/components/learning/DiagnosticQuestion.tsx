
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

const difficultyLabels: Record<QuizQuestion["difficulty_level"], string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjutan",
};

export default function DiagnosticQuestion({
  question,
  selectedAnswer,
  questionNumber,
  onSelect,
}: Props) {
  return (
    <section className="w-full">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#F0EAFB] px-3 py-1.5 text-xs font-bold text-[#7560B5]">
          Pertanyaan {String(questionNumber).padStart(2, "0")}
        </span>

        <span className="rounded-full border border-[#EAE2F0] bg-[#FFFCF8] px-3 py-1.5 text-xs font-semibold text-[#81778D]">
          {difficultyLabels[question.difficulty_level] ??
            question.difficulty_level}
        </span>
      </div>

      <h2 className="mb-7 text-xl font-bold leading-relaxed text-[#30213F] sm:text-2xl">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={isSelected}
              className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5 ${
                isSelected
                  ? "border-[#7560B5] bg-[#F5F0FF] shadow-[0_4px_18px_rgba(117,96,181,0.12)] ring-1 ring-[#7560B5]"
                  : "border-[#EAE2F0] bg-white hover:border-[#B7A7DD] hover:bg-[#FCF9FF]"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                  isSelected
                    ? "bg-[#7560B5] text-white"
                    : "bg-[#F5F1F8] text-[#7560B5] group-hover:bg-[#EEE7FB]"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>

              <span
                className={`flex-1 text-sm leading-6 sm:text-base ${
                  isSelected
                    ? "font-semibold text-[#30213F]"
                    : "text-[#5F566B]"
                }`}
              >
                {option.text}
              </span>

              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                  isSelected
                    ? "border-[#F43F91] bg-[#F43F91] text-white"
                    : "border-[#DED5E8] text-transparent group-hover:border-[#B7A7DD]"
                }`}
                aria-hidden="true"
              >
                ✓
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
