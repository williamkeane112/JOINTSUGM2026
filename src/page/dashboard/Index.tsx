
import { useEffect, useState } from "react";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
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
        // 1. Ambil data dari Supabase.
        const sourceData = await fetchDashboardData();

        // 2. Ubah data database ke format dashboard.
        const mappedData = mapDashboardData(sourceData);

        // 3. Hitung statistik dan rekomendasi.
        const dashboardData = buildDashboardData(
          mappedData.studentName,
          mappedData.topics,
          mappedData.masteryHistory,
          mappedData.quizAttemptsCount
        );

        // 4. Perbarui UI jika komponen masih aktif.
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
      <div className="min-h-screen bg-[#FFF9F0] px-4 py-10">
        <div
          className="mx-auto max-w-7xl animate-pulse space-y-6"
          aria-label="Memuat dashboard"
        >
          <div className="h-16 rounded-2xl bg-[#EAE2F0]" />
          <div className="h-24 rounded-2xl bg-white" />

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="h-48 rounded-2xl bg-[#EAE2F0]" />
            <div className="h-48 rounded-2xl bg-white" />
          </div>

          <div className="h-64 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] px-4 py-12">
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
      <DashboardHeader studentName={data.studentName} />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <WelcomeBanner studentName={data.studentName} />

        {hasTopics ? (
          <>
            <section className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
              <div className="lg:col-span-7">
                {recommendation ? (
                  <RecommendationCard
                    topicName={recommendation.topicName}
                    description={recommendation.description}
                    progress={recommendation.progress}
                    isCompleted={recommendation.isCompleted}
                  />
                ) : (
                  <EmptyState
                    title="Semua siap untuk perjalanan berikutnya"
                    description="Pilih topik baru untuk melanjutkan perjalanan belajarmu."
                    buttonLabel="Pilih Topik"
                  />
                )}
              </div>

              <div className="lg:col-span-5">
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
            href="/topicSelect"
          />
        )}

        <footer className="border-t border-[#EAE2F0] py-5 text-center">
          <p className="text-xs text-[#93879F]">
            SkillPath AI · Belajar sesuai kemampuanmu, berkembang setiap hari.
          </p>
        </footer>
      </main>
    </div>
  );
}
