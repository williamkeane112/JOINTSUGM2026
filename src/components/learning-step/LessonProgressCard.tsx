interface Props {
  activeSection: number;
  totalSections: number;
  completed: boolean;
}

export default function LessonProgressCard({
  activeSection,
  totalSections,
  completed,
}: Props) {
  const progress = completed
    ? 100
    : Math.round(((activeSection + 1) / totalSections) * 100);

  return (
    <section className="rounded-2xl border border-[#eee8f8] bg-white p-4 shadow-[0_5px_24px_-18px_rgba(51,36,83,0.3)] sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#342a4b]">Progres tahap ini</p>
          <p className="mt-1 text-xs text-[#898197]">
            {completed ? "Tahap ditandai selesai" : `Bagian ${activeSection + 1} dari ${totalSections}`}
          </p>
        </div>
        <span className="text-lg font-extrabold text-[#7653c5]">{progress}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eee8f7]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7855c8] to-[#a28ae2] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}
