
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
  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#30213F]">
            Perjalanan diagnostik
          </p>
          <p className="mt-1 text-sm text-[#81778D]">
            Pertanyaan {current} dari {total}
          </p>
        </div>

        <div className="rounded-full bg-[#F0EAFB] px-3 py-1.5 text-xs font-bold text-[#7560B5]">
          {answered}/{total} dijawab
        </div>
      </div>

      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-[#EEE8F3]"
        role="progressbar"
        aria-label="Progres jawaban"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7560B5] to-[#F43F91] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-[#958BA0]">
        <span>Progres pengerjaan</span>
        <span>{percentage}%</span>
      </div>
    </div>
  );
}
