import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Flame, Trophy, Zap } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { mockDashboardData } from "./mockData";
import {
  AchievementCard,
  CircularProgress,
  DiagnosticBanner,
  MobileBottomNav,
  RecommendationCard,
  Sidebar,
  StatCard,
  TopicMiniCard,
} from "./parts";

const data = mockDashboardData;

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (loading) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message || "Gagal keluar. Coba lagi.");
      setLoading(false);
      return;
    }

    navigate("/auth", { replace: true });
  }

  function handleStart() {
    // /learning belum dibuat — placeholder sampai route tersedia.
    console.log("Mulai belajar:", data.recommendedTopic?.name ?? "diagnostik");
  }

  const firstName = data.studentName.split(" ")[0];
  const streakDots = Array.from({ length: 7 }, (_, i) => i < data.streakDays);

  return (
    <div className="min-h-screen bg-[#FFF7F2]">
      <Sidebar
        userName={data.studentName}
        level={data.level}
        activePath={location.pathname}
        onLogout={handleLogout}
      />
      <MobileBottomNav activePath={location.pathname} onLogout={handleLogout} />

      <main className="mx-auto max-w-[1280px] px-4 py-6 pb-24 lg:pl-64 lg:pr-8 lg:pb-10 lg:pt-8">
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-[10px] border border-[#f5c6d0] bg-[#fce8ec] px-3 py-2.5 text-sm text-[#c42752]"
          >
            {error}
          </p>
        )}

        {/* Greeting header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-[-0.02em] text-[#17111F] md:text-3xl">
              Selamat pagi, {firstName}! 👋
            </h1>
            <p className="mt-1 text-sm text-[#766B7F]">
              Kamu sudah belajar {data.streakDays} hari berturut-turut 🔥
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
              style={{ background: "#FDE9DF", color: "#F2763C" }}
            >
              <Flame className="h-4 w-4" aria-hidden="true" />
              <span className="tabular">{data.streakDays}</span>
            </span>
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
              style={{ background: "#F3ECFA", color: "#6D36BD" }}
            >
              <Zap className="h-4 w-4" aria-hidden="true" />
              <span className="tabular">
                {data.totalXp.toLocaleString("id-ID")} XP
              </span>
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div
            className="flex flex-col items-center justify-center gap-2 rounded-[14px] bg-white p-5"
            style={{ border: "1px solid #EADFE4" }}
          >
            <CircularProgress value={data.overallMastery} />
            <span className="text-xs text-[#766B7F]">Overall Mastery</span>
          </div>

          <StatCard
            icon={<Zap className="h-4 w-4" />}
            iconBg="#F3ECFA"
            iconColor="#6D36BD"
            label="Total XP"
            value={data.totalXp.toLocaleString("id-ID")}
            valueColor="#6D36BD"
          >
            <div className="mt-1">
              <div
                className="h-1.5 w-full overflow-hidden rounded-full"
                style={{ background: "#EADFE4" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: "60%", background: "#6D36BD" }}
                />
              </div>
              <p className="mt-1 text-[11px] text-[#766B7F]">
                Level {data.level} → {data.level + 1}
              </p>
            </div>
          </StatCard>

          <StatCard
            icon={<Flame className="h-4 w-4" />}
            iconBg="#FDE9DF"
            iconColor="#F2763C"
            label="Streak"
            value={`${data.streakDays} Hari`}
            valueColor="#F2763C"
          >
            <div className="mt-1 flex gap-1" aria-hidden="true">
              {streakDots.map((filled, i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: filled ? "#F2763C" : "transparent",
                    border: filled ? "none" : "1px solid #EADFE4",
                  }}
                />
              ))}
            </div>
          </StatCard>

          <StatCard
            icon={<Trophy className="h-4 w-4" />}
            iconBg="#E3F6EC"
            iconColor="#1E9E6B"
            label="Topik Dikuasai"
            value={`${data.topicsMastered}/${data.totalTopics}`}
            valueColor="#1E9E6B"
          />
        </div>

        {/* Main split */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-3 font-display text-lg font-bold tracking-[-0.02em] text-[#17111F]">
              Rekomendasi Untukmu
            </h2>
            {data.recommendedTopic ? (
              <RecommendationCard
                topic={data.recommendedTopic}
                onStart={handleStart}
              />
            ) : (
              <DiagnosticBanner onStart={handleStart} />
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div
              className="rounded-[14px] bg-white p-5"
              style={{ border: "1px solid #EADFE4" }}
            >
              <h2 className="mb-3 text-sm font-semibold text-[#17111F]">
                Aktivitas Terakhir
              </h2>
              {data.recentActivity.length === 0 ? (
                <p className="text-xs text-[#766B7F]">
                  Belum ada aktivitas belajar.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {data.recentActivity.map((activity, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span
                        className="h-2 w-2 flex-none rounded-full"
                        style={{ background: "#1E9E6B" }}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-[#17111F]">
                          {activity.topic}
                        </p>
                        <p className="text-xs text-[#766B7F]">
                          {activity.timeAgo}
                        </p>
                      </div>
                      <span
                        className="flex-none rounded-full px-2 py-0.5 text-xs font-semibold tabular"
                        style={{ background: "#F3ECFA", color: "#6D36BD" }}
                      >
                        +{activity.xpGained} XP
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div
              className="rounded-[14px] p-4"
              style={{ background: "#F3ECFA" }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="grid h-8 w-8 flex-none place-items-center rounded-full"
                  style={{ background: "#6D36BD", color: "white" }}
                  aria-hidden="true"
                >
                  <Zap className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#6D36BD]">
                    Tip dari Spark
                  </p>
                  <p className="mt-1 text-sm text-[#6D36BD]">
                    Istirahat 5 menit setiap 25 menit belajar bisa bikin
                    otakmu lebih fokus! 🧠
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge map preview */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-[#17111F]">
              Peta Kemampuanmu
            </h2>
            <span
              className="cursor-not-allowed text-sm font-semibold text-[#AFA3AC]"
              aria-disabled="true"
              title="Halaman Peta Kemampuan belum tersedia"
            >
              Lihat semua →
            </span>
          </div>
          <div className="scrollbar-themed flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
            {data.knowledgeMapPreview.map((topic) => (
              <TopicMiniCard
                key={topic.name}
                name={topic.name}
                status={topic.status}
                mastery={topic.mastery}
              />
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-4 mt-8">
          <h2 className="mb-3 font-display text-lg font-bold tracking-[-0.02em] text-[#17111F]">
            Pencapaian Terbaru
          </h2>
          <div className="scrollbar-themed flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {data.achievements.map((achievement) => (
              <AchievementCard
                key={achievement.title}
                title={achievement.title}
                description={achievement.description}
                unlocked={achievement.unlocked}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
