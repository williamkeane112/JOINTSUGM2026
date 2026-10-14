
import { useNavigate } from "react-router-dom";
import { useExploreTopics } from "../../hooks/useExploreTopics";

import TopicsHeader from "../../components/topic/TopicsHeader";
import TopicSearchBar from "../../components/topic/TopicSearchBar";
import CategoryFilter from "../../components/topic/CategoryFilter";
import TopicGrid from "../../components/topic/TopicGrid";
import TopicPagination from "../../components/topic/TopicPagination";

export default function ExploreTopics() {
  const navigate = useNavigate();

  const {
    categories,
    topics,
    latestGoalByTopic,
    search,
    selectedCategory,
    currentPage,
    totalTopics,
    totalPages,
    initialLoading,
    topicsLoading,
    selectingTopicId,
    error,
    changeSearch,
    changeCategory,
    changePage,
    retry,
    selectTopic,
  } = useExploreTopics();

  if (initialLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
        <div className="mx-auto max-w-6xl animate-pulse space-y-3">
          <div className="h-3 w-28 rounded bg-slate-200" />
          <div className="h-8 w-72 max-w-full rounded bg-slate-200" />
          <div className="h-4 w-96 max-w-full rounded bg-slate-200" />
          <div className="mt-5 h-16 rounded-xl bg-slate-200" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 md:px-6 md:py-7">
      <div className="mx-auto max-w-6xl">
        <TopicsHeader />

        <section className="mb-4 rounded-xl border border-slate-200 bg-white p-3 md:p-4">
          <TopicSearchBar
            value={search}
            onChange={changeSearch}
          />

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={changeCategory}
          />
        </section>

        {error && (
          <div
            role="alert"
            className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={retry}
              className="font-semibold underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-700">
            Katalog topik
            <span className="ml-2 font-normal text-slate-500">
              {totalTopics} topik
            </span>
          </p>

          <p className="text-xs text-slate-500">
            Halaman {currentPage} dari {totalPages}
          </p>
        </div>

        <TopicGrid
          topics={topics}
          loading={topicsLoading}
          selectingTopicId={selectingTopicId}
          latestGoalByTopic={latestGoalByTopic}
          onSelect={selectTopic}
          onRequestTopic={() => navigate("/learning-goals/new")}
        />

        {!topicsLoading && topics.length > 0 && (
          <>
            <TopicPagination
              currentPage={currentPage}
              totalPages={totalPages}
              loading={topicsLoading}
              onChange={changePage}
            />

            <p className="mt-3 text-center text-xs text-slate-500">
              Menampilkan {topics.length} dari {totalTopics} topik.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
