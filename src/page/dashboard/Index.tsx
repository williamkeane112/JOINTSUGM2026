import { useEffect, useState } from "react";

import DashboardSidebar from "../../components/layout/DashboardSidebar";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import RecommendationCard from "../../components/dashboard/RecommendationCard";
import StatsGrid from "../../components/dashboard/StatsGrid";
import MasteryChart from "../../components/dashboard/MasteryChart";
import TopicGrid from "../../components/dashboard/TopicGrid";
import EmptyState from "../../components/dashboard/EmptyState";

import { fetchDashboardData } from "../../lib/dashboard/dashboardService";
import { mapDashboardData } from "../../lib/dashboard/dashboardMapper";
import { buildDashboardData } from "../../lib/dashboard/dashboardLogic";

import type { DashboardData } from "../../lib/dashboard/types";

export default function Index() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const sourceData = await fetchDashboardData();
        const mappedData = mapDashboardData(sourceData);

        const dashboardData = buildDashboardData(
          mappedData.studentName,
          mappedData.topics,
          mappedData.masteryHistory,
          mappedData.quizAttemptsCount
        );

        if (!cancelled) {
          setData(dashboardData);
        }
      } catch (err) {
        console.error("Gagal memuat dashboard:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan saat memuat dashboard."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0]">
        <div className="fixed inset-y-0 left-0 hidden w-[260px] animate-pulse border-r border-[#EAE2F0] bg-white p-5 lg:block">
          <div className="h-12 rounded-xl bg-[#EAE2F0]" />
          <div className="mt-8 h-12 rounded-xl bg-[#F5F0FA]" />
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
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] px-4 py-12 lg:pl-[284px]">
        <div
          className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-6"
          role="alert"
        >
          <h1 className="text-lg font-bold text-[#29243B]">
            Dashboard tidak dapat dimuat
          </h1>

          <p className="mt-2 text-sm leading-6 text-red-600">
            {error || "Data dashboard belum tersedia."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-[#7560B5] px-5 py-3 text-sm font-semibold text-white hover:bg-[#62509B]"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  const hasTopics = data.topics.length > 0;
  const recommendation = data.recommendation;

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <DashboardSidebar studentName={data.studentName} />

      <main className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:ml-[260px] lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header konten */}
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

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#EAE2F0] bg-white px-4 py-2 text-xs font-semibold text-[#7560B5]">
              <span className="size-2 rounded-full bg-[#65B88B]" />
              Progress tersimpan
            </span>
          </header>

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
                  <StatsGrid
                    totalTopics={data.stats.totalTopics}
                    completedTopics={data.stats.completedTopics}
                    masteryPercentage={data.stats.masteryPercentage}
                    totalSessions={data.stats.totalSessions}
                  />
                </div>
              </section>

              <MasteryChart
                data={data.masteryHistory}
                currentMastery={data.stats.masteryPercentage}
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
