import { BookOpen, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useExploreTopics } from "../../hooks/useExploreTopics";

import DashboardSidebar from "../../components/layout/DashboardSidebar";
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

  // Tampilan loading
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] lg:pl-[260px]">
        <DashboardSidebar studentName="Pelajar" />

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl animate-pulse space-y-6">
            <div className="h-4 w-28 rounded-full bg-[#EAE2F0]" />

            <div className="h-9 w-72 max-w-full rounded-lg bg-[#EAE2F0]" />

            <div className="h-4 w-96 max-w-full rounded-lg bg-[#F0E9F2]" />

            <div className="h-32 rounded-3xl bg-white" />

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="h-56 rounded-2xl border border-[#EAE2F0] bg-white"
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-[#29243B] lg:pl-[260px]">
      {/* Sidebar */}
      <DashboardSidebar studentName="Pelajar" />

      {/* Konten utama */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header halaman */}
        <TopicsHeader />

        {/* Pencarian dan filter kategori */}
        <section className="mb-7 rounded-3xl border border-[#EAE2F0] bg-white p-4 shadow-[0_8px_30px_rgba(48,33,63,0.035)] sm:p-6">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F1EBFF] text-[#7560B5]">
              <BookOpen size={20} />
            </div>

            <div>
              <h2 className="font-bold text-[#29243B]">
                Temukan topik favoritmu
              </h2>

              <p className="mt-1 text-sm leading-5 text-[#93879F]">
                Cari berdasarkan nama topik atau pilih kategori yang kamu
                minati.
              </p>
            </div>
          </div>

          <TopicSearchBar
            value={search}
            onChange={changeSearch}
          />

          <div className="mt-5 border-t border-[#F0E9F2] pt-4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onChange={changeCategory}
            />
          </div>
        </section>

        {/* Pesan error */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={retry}
              className="rounded-lg px-3 py-1.5 font-semibold transition hover:bg-red-100"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Katalog topik */}
        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#F43F91]" />

                <h2 className="text-lg font-bold text-[#29243B]">
                  Katalog topik
                </h2>
              </div>

              <p className="mt-1.5 text-sm text-[#93879F]">
                Pilih topik dan mulai perjalanan belajarmu.
              </p>
            </div>

            <div className="rounded-full border border-[#EAE2F0] bg-white px-3.5 py-2 text-xs font-medium text-[#7560B5]">
              {totalTopics} topik tersedia
            </div>
          </div>

          <TopicGrid
            topics={topics}
            loading={topicsLoading}
            selectingTopicId={selectingTopicId}
            latestGoalByTopic={latestGoalByTopic}
            onSelect={selectTopic}
            onRequestTopic={() => navigate("/topic/request")}
          />

          {/* Pagination */}
          {!topicsLoading && topics.length > 0 && (
            <div className="mt-7">
              <TopicPagination
                currentPage={currentPage}
                totalPages={totalPages}
                loading={topicsLoading}
                onChange={changePage}
              />

              <p className="mt-4 text-center text-xs text-[#93879F]">
                Menampilkan {topics.length} dari {totalTopics} topik
                {" · "}
                Halaman {currentPage} dari {totalPages}
              </p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-[#EAE2F0] py-6 text-center">
          <p className="text-xs leading-5 text-[#93879F]">
            SkillPath AI · Belajar sesuai kemampuanmu, berkembang setiap hari.
          </p>
        </footer>
      </main>
    </div>
  );
}
