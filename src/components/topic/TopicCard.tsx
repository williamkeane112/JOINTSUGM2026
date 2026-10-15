
import { ArrowRight, BookOpen, CheckCircle2, LoaderCircle } from "lucide-react";
import type {
  ExistingGoal,
  Topic,
} from "../../hooks/useExploreTopics";

type Props = {
  topic: Topic;
  existingGoal?: ExistingGoal;
  isSelecting: boolean;
  disabled: boolean;
  onSelect: (topic: Topic) => void;
};

function formatDifficulty(value: string) {
  const labels: Record<string, string> = {
    beginner: "Pemula",
    intermediate: "Menengah",
    advanced: "Lanjutan",
    all: "Semua tingkat",
  };

  return labels[value.toLowerCase()] ?? value;
}

export default function TopicCard({
  topic,
  existingGoal,
  isSelecting,
  disabled,
  onSelect,
}: Props) {
  return (
    <article className="group flex min-h-[245px] flex-col overflow-hidden rounded-2xl border border-[#EAE2F0] bg-white p-5 shadow-[0_5px_20px_rgba(48,33,63,0.025)] transition duration-200 hover:-translate-y-1 hover:border-[#CFC3E9] hover:shadow-[0_12px_30px_rgba(48,33,63,0.075)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F1EBFF] text-[#7560B5] transition group-hover:bg-[#E8DEFF]">
          <BookOpen size={21} strokeWidth={1.8} />
        </div>

        {existingGoal ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#D8CEE9] bg-[#F8F4FF] px-2.5 py-1 text-[10px] font-semibold text-[#7560B5]">
            <CheckCircle2 size={12} />
            Sudah dipilih
          </span>
        ) : (
          <span className="rounded-full bg-[#FFF0F7] px-2.5 py-1 text-[10px] font-semibold text-[#D92D7C]">
            Topik tersedia
          </span>
        )}
      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8B78C2]">
        {topic.subject}
      </p>

      <h2 className="mt-1.5 text-base font-bold leading-snug text-[#29243B]">
        {topic.name}
      </h2>

      <p className="mt-2 flex-1 text-sm leading-6 text-[#93879F]">
        {topic.description ?? "Pelajari topik ini secara bertahap bersama SkillPath AI."}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#F0E9F2] pt-3">
        <span className="text-xs text-[#93879F]">
          Tingkat:{" "}
          <span className="font-semibold text-[#625477]">
            {formatDifficulty(topic.difficulty_level)}
          </span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => onSelect(topic)}
        disabled={disabled}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7560B5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#62509B] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSelecting ? (
          <>
            <LoaderCircle size={16} className="animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            {existingGoal ? "Lanjutkan Belajar" : "Mulai Belajar"}
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </article>
  );
}
