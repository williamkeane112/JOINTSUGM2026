
import { SearchX, Sparkles } from "lucide-react";
import TopicCard from "./TopicCard";
import TopicGridSkeleton from "./TopicGridSkeleton";
import type {
  ExistingGoal,
  Topic,
} from "../../hooks/useExploreTopics";

type Props = {
  topics: Topic[];
  loading: boolean;
  selectingTopicId: number | null;
  latestGoalByTopic: Map<number, ExistingGoal>;
  onSelect: (topic: Topic) => void;
  onRequestTopic: () => void;
};

export default function TopicGrid({
  topics,
  loading,
  selectingTopicId,
  latestGoalByTopic,
  onSelect,
  onRequestTopic,
}: Props) {
  if (loading) {
    return <TopicGridSkeleton />;
  }

  if (topics.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#D8CEE9] bg-white px-5 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1EBFF] text-[#7560B5]">
          <SearchX size={26} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-[#29243B]">
          Topik tidak ditemukan
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#93879F]">
          Coba kata kunci atau kategori lain. Kamu juga bisa mengajukan topik
          baru jika materi yang dicari belum tersedia.
        </p>

        <button
          type="button"
          onClick={onRequestTopic}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#7560B5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#62509B]"
        >
          <Sparkles size={16} />
          Ajukan Topik Baru
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          existingGoal={latestGoalByTopic.get(topic.id)}
          isSelecting={selectingTopicId === topic.id}
          disabled={selectingTopicId !== null}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
