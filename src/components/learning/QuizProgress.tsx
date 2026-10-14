
type Props = {
  current: number;
  total: number;
  answered: number;
};

export default function QuizProgress({
  current,
  total,
  answered,
}: Props) {
  const percentage =
    total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className="mb-7">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Diagnostic Assessment
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Pertanyaan {current} dari {total}
          </p>
        </div>

        <span className="text-sm font-semibold text-emerald-700">
          {answered}/{total} dijawab
        </span>
      </div>

      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label="Progress jawaban"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
