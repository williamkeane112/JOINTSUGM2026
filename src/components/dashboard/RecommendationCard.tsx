import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface RecommendationCardProps {
  topicName?: string;
  description?: string;
  progress?: number;
  isCompleted?: boolean;
  learningGoalId?: string | number;
}

export default function RecommendationCard({
  topicName = "Pecahan",
  description = "Penguasaanmu paling rendah di sini, dan syaratnya sudah terpenuhi.",
  progress = 34,
  isCompleted = false,
  learningGoalId,
}: RecommendationCardProps) {
  const mastery = Math.max(0, Math.min(100, progress));

  // Jika topik sudah selesai, arahkan ke pemilihan topik.
  // Jika belum, buka detail learning goal.
  const targetPath = isCompleted
    ? "/topic"
    : learningGoalId
      ? `/learning-goals/${learningGoalId}`
      : "/topic";

  return (
    <section className="flex min-h-[188px] flex-col justify-between gap-5 rounded-xl bg-[#190820] p-5 text-white sm:flex-row sm:items-center sm:p-6">
      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          {isCompleted ? "Pilih topik berikutnya" : `Lanjut ke ${topicName}`}
        </h2>

        <p className="mt-1 max-w-sm text-xs leading-5 text-white/70">
          {description}
        </p>

        <Link
          to={targetPath}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#F44389] px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:bg-[#E83278]"
        >
          {isCompleted ? "Pilih topik" : "Lanjutkan belajar"}
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="w-full shrink-0 sm:w-[192px]">
        <div className="flex items-baseline justify-start sm:justify-center">
          <span className="text-5xl font-bold tracking-tight sm:text-6xl">
            {mastery}
          </span>
          <span className="text-2xl font-bold">%</span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-[#E94B50] transition-all"
            style={{ width: `${mastery}%` }}
          />
        </div>

        <div className="relative mt-1 h-4 text-[9px] text-white/50">
          <span className="absolute left-[40%]">40</span>
          <span className="absolute left-[70%]">70</span>
        </div>

        <div className="mt-1 flex justify-center">
          <span className="rounded-full bg-[#FCE4DF] px-2.5 py-1 text-[9px] font-medium text-[#A83C42]">
            {isCompleted
              ? "Sudah dikuasai"
              : mastery < 40
                ? "Perlu dikuatkan"
                : mastery < 70
                  ? "Sedang berkembang"
                  : "Hampir dikuasai"}
          </span>
        </div>
      </div>
    </section>
  );
}