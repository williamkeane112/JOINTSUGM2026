import { CheckCircle2 } from "lucide-react";

interface StatsGridProps {
  totalTopics?: number;
  completedTopics?: number;
  masteryPercentage?: number;
  totalSessions?: number;
  questionsAnswered?: number;
  streakDays?: number;
}

export default function StatsGrid({
  totalTopics = 3,
  completedTopics = 1,
  masteryPercentage = 62,
  totalSessions = 47,
  questionsAnswered,
  streakDays = 4,
}: StatsGridProps) {
  const questions = questionsAnswered ?? totalSessions;

  return (
    <section className="rounded-xl border border-[#F0E8E2] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xs font-semibold text-[#211829]">
        Progres belajar
      </h2>

      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-base font-bold text-[#211829]">
          {completedTopics} dari {totalTopics} topik dikuasai
        </span>
        <CheckCircle2
          size={15}
          className="shrink-0 text-[#22A477]"
        />
      </div>

      <div
        className="mt-2 flex h-1.5 gap-1"
        aria-label="Ringkasan progres topik"
      >
        <div className="flex-1 rounded-full bg-[#159D70]" />
        <div className="flex-1 rounded-full bg-[#E94B50]" />
        <div className="flex-1 rounded-full bg-[#EFA633]" />
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] text-[#938A98]">
            Rata-rata penguasaan
          </span>
          <span className="text-xs font-bold text-[#211829]">
            {masteryPercentage}%
          </span>
        </div>

        <div className="h-px bg-[#F0E8E2]" />

        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] text-[#938A98]">
            Soal dijawab
          </span>
          <span className="text-xs font-bold text-[#211829]">
            {questions}
          </span>
        </div>

        <div className="h-px bg-[#F0E8E2]" />

        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] text-[#938A98]">
            Streak
          </span>
          <span className="text-xs font-bold text-[#211829]">
            {streakDays} hari
          </span>
        </div>
      </div>
    </section>
  );
}
