
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import DashboardSidebar from "../../components/layout/DashboardSidebar";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import RecommendationCard from "../../components/dashboard/RecommendationCard";
import ActivityOverview from "../../components/dashboard/ActivityOverview";
import TopicGrid from "../../components/dashboard/TopicGrid";
import EmptyState from "../../components/dashboard/EmptyState";
import MasteryChart from "../../components/dashboard/MasteryChart";

import { fetchDashboardData } from "../../lib/dashboard/dashboardService";
import { mapDashboardData } from "../../lib/dashboard/dashboardMapper";
import { buildDashboardData } from "../../lib/dashboard/dashboardLogic";

import type {
  DashboardData,
  MasteryPoint,
} from "../../lib/dashboard/types";

type DashboardPageData = DashboardData & {
  skillNetwork: MasteryPoint[];
  learningGoalId?: string;
};

export default function Index() {
  const location = useLocation();

  const [data, setData] = useState<DashboardPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestIdRef = useRef(0);

  const loadDashboard = useCallback(async (showLoading = true) => {
    const requestId = ++requestIdRef.current;

    if (showLoading) setLoading(true);
    setError("");

    try {
      const sourceData = await fetchDashboardData();
      const mappedData = mapDashboardData(sourceData);

      const dashboardBase = buildDashboardData(
        mappedData.studentName,
        mappedData.topics,
        mappedData.masteryHistory,
        mappedData.quizAttemptsCount,
        mappedData.streakDays,
      );

      // topicId dari recommendation merupakan ID learning goal.
      const learningGoalId = dashboardBase.recommendation?.topicId;

    const dashboardData: DashboardPageData = {
        ...dashboardBase,
        skillNetwork: mappedData.skillNetwork ?? [],
        learningGoalId: dashboardBase.recommendation?.topicId,
      };

      if (requestId !== requestIdRef.current) return;

      setData(dashboardData);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      console.error("Gagal memuat dashboard:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memuat dashboard.",
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);
  

  useEffect(() => {
    void loadDashboard();

    return () => {
      requestIdRef.current += 1;
    };
  }, [loadDashboard, location.key]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#FFF9F0]">
        <div className="fixed inset-y-0 left-0 hidden w-[260px] animate-pulse border-r border-[#EAE2F0] bg-white p-5 lg:block">
          <div className="h-12 rounded-xl bg-[#EAE2F0]" />
          <div className="mt-8 h-12 rounded-xl bg-[#F5F0FA]" />
          <div className="mt-4 h-12 rounded-xl bg-[#F5F0FA]" />
          <div className="mt-4 h-12 rounded-xl bg-[#F5F0FA]" />
        </div>

        <main className="px-4 py-8 lg:ml-[260px] lg:px-8">
          <div className="mx-auto max-w-7xl animate-pulse space-y-6">
            <div className="h-10 w-64 rounded-xl bg-[#EAE2F0]" />
            <div className="h-56 rounded-3xl bg-white" />
            <div className="grid gap-5 xl:grid-cols-2">
              <div className="h-48 rounded-2xl bg-white" />
              <div className="h-48 rounded-2xl bg-white" />
            </div>
            <div className="h-64 rounded-3xl bg-white" />
            <p className="animate-none text-sm text-[#93879F]">
              Memuat progres belajarmu...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] px-4 py-12 lg:pl-[284px]">
        <div
          className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-6"
          role="alert"
        >
          <h1 className="text-lg font-bold text-[#29243B]">
            Dashboard tidak dapat dimuat
          </h1>
          <p className="mt-2 text-sm leading-6 text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="mt-5 rounded-xl bg-[#7560B5] px-5 py-3 text-sm font-semibold text-white hover:bg-[#62509B]"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const hasTopics = data.topics.length > 0;
  const recommendation = data.recommendation;

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <DashboardSidebar studentName={data.studentName} />

      <main className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:ml-[260px] lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-[#93879F]">
                SkillPath AI / Dashboard
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#29243B] sm:text-3xl">
                Dashboard Belajar
              </h1>
              <p className="mt-2 text-sm text-[#93879F]">
                Pantau perkembangan dan lanjutkan perjalanan belajarmu.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#EAE2F0] bg-white px-4 py-2 text-xs font-semibold text-[#7560B5]">
                <span
                  className={`size-2 rounded-full ${
                    error ? "bg-amber-500" : "bg-[#65B88B]"
                  }`}
                />
                {error ? "Data mungkin belum terbaru" : "Progress tersimpan"}
              </span>

              <button
                type="button"
                disabled={loading}
                onClick={() => void loadDashboard()}
                className="rounded-xl border border-[#EAE2F0] bg-white px-4 py-2 text-xs font-semibold text-[#7560B5] transition hover:bg-[#F5F0FA] disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? "Memperbarui..." : "Refresh"}
              </button>
            </div>
          </header>

          {error && (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-amber-800">
                Data terbaru gagal dimuat: {error}
              </p>
              <button
                type="button"
                onClick={() => void loadDashboard()}
                className="shrink-0 text-left text-sm font-semibold text-amber-900 underline"
              >
                Coba lagi
              </button>
            </div>
          )}

          <WelcomeBanner studentName={data.studentName} />

          {hasTopics ? (
            <>
              <section className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
                <div className="min-w-0 xl:col-span-7">
                  {recommendation ? (
                    <RecommendationCard
                      topicName={recommendation.topicName}
                      description={recommendation.description}
                      progress={recommendation.progress}
                      isCompleted={recommendation.isCompleted}
                      learningGoalId={recommendation.topicId}
                    />
                  ) : (
                    <EmptyState
                      title="Siap memulai perjalanan berikutnya?"
                      description="Pilih topik baru untuk melanjutkan perjalanan belajarmu."
                      buttonLabel="Pilih Topik"
                      href="/topic"
                    />
                  )}
                </div>

                <div className="min-w-0 xl:col-span-5">
                  <ActivityOverview
                    totalTopics={data.stats.totalTopics}
                    completedTopics={data.stats.completedTopics}
                    inProgressTopics={data.stats.inProgressTopics}
                    notStartedTopics={data.stats.notStartedTopics}
                    totalQuestions={data.stats.totalSessions}
                    streakDays={data.stats.streakDays}
                  />
                </div>
              </section>

              <MasteryChart
                data={data.skillNetwork}
                currentMastery={data.stats.masteryPercentage}
                learningGoalId={data.learningGoalId}
              />

              <TopicGrid
                topics={data.topics}
                title="Topik Pembelajaran"
                description="Lihat progres dan lanjutkan materi yang ingin kamu kuasai."
                limit={6}
              />
            </>
          ) : (
            <EmptyState
              title="Mulai perjalanan belajarmu"
              description="Pilih topik pertama yang ingin kamu pelajari. SkillPath AI akan membantumu belajar secara bertahap."
              buttonLabel="Pilih Topik Pertama"
              href="/topic"
            />
          )}

          <footer className="border-t border-[#EAE2F0] py-5 text-center">
            <p className="text-xs text-[#93879F]">
              SkillPath AI · Belajar sesuai kemampuanmu, berkembang setiap hari.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
