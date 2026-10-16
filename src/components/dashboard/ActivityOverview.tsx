
import { CheckCircle2 } from "lucide-react";

interface ActivityOverviewProps {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  notStartedTopics: number;
  totalQuestions: number;
  streakDays: number;
  masteryPercentage?: number;
}

export default function ActivityOverview({
  totalTopics,
  completedTopics,
  inProgressTopics,
  notStartedTopics,
  totalQuestions,
  streakDays,
}: ActivityOverviewProps) {
  const total = Math.max(0, totalTopics);
  const completed = Math.max(0, completedTopics);
  const inProgress = Math.max(0, inProgressTopics);
  const notStarted = Math.max(0, notStartedTopics);


  const completionRate =
    total > 0
      ? Math.min(100, (completed / total) * 100)
      : 0;

  const inProgressRate =
    total > 0
      ? Math.min(100, (inProgress / total) * 100)
      : 0;

  const notStartedRate =
    total > 0
      ? Math.min(100, (notStarted / total) * 100)
      : 0;

  return (
    <section className="rounded-xl border border-[#EAE2F0] bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-[#29243B]">
        Progres belajar
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <h2 className="text-base font-bold text-[#29243B]">
          {completed} dari {total} topik dikuasai
        </h2>

        <CheckCircle2
          size={15}
          className="text-emerald-500"
          aria-hidden="true"
        />
      </div>

      <div
        className="mt-2.5 flex h-1.5 gap-1 overflow-hidden rounded-full"
        role="img"
        aria-label={`${completed} topik selesai, ${inProgress} sedang dipelajari, ${notStarted} belum dimulai`}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${completionRate}%` }}
        />

        <div
          className="h-full rounded-full bg-rose-500 transition-all"
          style={{ width: `${inProgressRate}%` }}
        />

        <div
          className="h-full rounded-full bg-amber-500 transition-all"
          style={{ width: `${notStartedRate}%` }}
        />
      </div>

     <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-[11px] text-[#93879F]">
          Penyelesaian topik
        </span>

        <span className="text-xs font-semibold text-[#29243B]">
          {Math.round(completionRate)}%
        </span>
      </div>
      <div className="mt-3 border-t border-[#F0E8F2]" />

      <div className="flex items-center justify-between gap-3 py-3">
        <span className="text-[11px] text-[#93879F]">
          Soal dijawab
        </span>

        <span className="text-xs font-semibold text-[#29243B]">
          {Math.max(0, totalQuestions)}
        </span>
      </div>

      <div className="border-t border-[#F0E8F2]" />

      <div className="flex items-center justify-between gap-3 pt-3">
        <span className="text-[11px] text-[#93879F]">
          Streak
        </span>

        <span className="text-xs font-semibold text-[#29243B]">
          {Math.max(0, streakDays)} {streakDays === 1 ? "hari" : "hari"}
        </span>
      </div>
    </section>
  );
}
