import { CheckCircle2 } from "lucide-react";

interface StatsGridProps {
  totalTopics?: number;
  completedTopics?: number;
  masteryPercentage?: number;
  totalSessions?: number;
  questionsAnswered?: number;
  streakDays?: number;
  inProgressTopics?: number;
  notStartedTopics?: number;
}

export default function StatsGrid({
  totalTopics = 0,
  completedTopics = 0,
  masteryPercentage = 0,
  totalSessions = 0,
  questionsAnswered,
  streakDays = 0,
  inProgressTopics = 0,
}: StatsGridProps) {
  const safeTotal = Math.max(0, Math.floor(totalTopics));
  const safeCompleted = Math.min(
    safeTotal,
    Math.max(0, Math.floor(completedTopics)),
  );
  const safeInProgress = Math.min(
    safeTotal - safeCompleted,
    Math.max(0, Math.floor(inProgressTopics)),
  );
  // Derive remaining topics from actual counts to avoid a stale/default prop
  // making the entire bar yellow.
  const safeNotStarted = Math.max(
    0,
    safeTotal - safeCompleted - safeInProgress,
  );

  const safeMastery = Math.max(
    0,
    Math.min(100, Math.round(masteryPercentage)),
  );
  const questions = Math.max(
    0,
    Math.floor(questionsAnswered ?? totalSessions),
  );
  const safeStreak = Math.max(0, Math.floor(streakDays));

  return (
    <section className="rounded-xl border border-[#F0E8E2] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xs font-semibold text-[#211829]">
        Progres belajar
      </h2>

      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-base font-bold text-[#211829]">
          {safeCompleted} dari {safeTotal} topik dikuasai
        </span>
        <CheckCircle2 size={15} className="shrink-0 text-[#22A477]" />
      </div>

      <div
        className="mt-2 flex h-1.5 gap-1 overflow-hidden rounded-full"
        aria-label={`Topik selesai ${safeCompleted}, sedang dipelajari ${safeInProgress}, belum dimulai ${safeNotStarted}`}
      >
        {safeTotal > 0 ? (
          <>
            {safeCompleted > 0 && (
              <div
                className="h-full min-w-0 rounded-full bg-[#159D70] transition-all duration-500"
                style={{ flex: `${safeCompleted} 1 0%` }}
                title={`${safeCompleted} topik selesai`}
              />
            )}
            {safeInProgress > 0 && (
              <div
                className="h-full min-w-0 rounded-full bg-[#E94B50] transition-all duration-500"
                style={{ flex: `${safeInProgress} 1 0%` }}
                title={`${safeInProgress} topik sedang dipelajari`}
              />
            )}
            {safeNotStarted > 0 && (
              <div
                className="h-full min-w-0 rounded-full bg-[#EFA633] transition-all duration-500"
                style={{ flex: `${safeNotStarted} 1 0%` }}
                title={`${safeNotStarted} topik belum dimulai`}
              />
            )}
          </>
        ) : (
          <div className="h-full w-full rounded-full bg-[#F0E8E2]" />
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] text-[#938A98]">
            Rata-rata penguasaan
          </span>
          <span className="text-xs font-bold text-[#211829]">
            {safeMastery}%
          </span>
        </div>

        <div className="h-px bg-[#F0E8E2]" />

        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] text-[#938A98]">Soal dijawab</span>
          <span className="text-xs font-bold text-[#211829]">
            {questions}
          </span>
        </div>

        <div className="h-px bg-[#F0E8E2]" />

        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] text-[#938A98]">Streak</span>
          <span className="text-xs font-bold text-[#211829]">
            {safeStreak} hari
          </span>
        </div>
      </div>
    </section>
  );
}
