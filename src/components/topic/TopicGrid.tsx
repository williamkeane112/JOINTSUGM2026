
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
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
        <h2 className="font-semibold text-slate-800">
          Topik tidak ditemukan
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Coba kata kunci atau kategori lain.
        </p>

        <button
          type="button"
          onClick={onRequestTopic}
          className="mt-3 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          + Ajukan Topik Baru
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
