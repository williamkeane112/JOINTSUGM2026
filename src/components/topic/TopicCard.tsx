
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

export default function TopicCard({
  topic,
  existingGoal,
  isSelecting,
  disabled,
  onSelect,
}: Props) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-violet-200 hover:shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-600">
        {topic.subject}
      </p>

      <h2 className="mt-1.5 text-base font-bold leading-snug text-slate-900">
        {topic.name}
      </h2>

      <p className="mt-1.5 flex-1 text-sm leading-5 text-slate-600">
        {topic.description ?? "Pelajari topik ini secara bertahap."}
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs capitalize text-slate-500">
          Tingkat: {topic.difficulty_level}
        </span>

        {existingGoal && (
          <span className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-700">
            Sudah dipilih
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => onSelect(topic)}
        disabled={disabled}
        className="mt-3 w-full rounded-lg bg-violet-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSelecting
          ? "Memproses..."
          : existingGoal
            ? "Lanjutkan Belajar"
            : "Mulai Belajar"}
      </button>
    </article>
  );
}
