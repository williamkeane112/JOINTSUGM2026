import { getMasteryStatus } from "../../lib/mastery";
import { startedTopics, type DashboardSummary } from "./dashboardLogic";
import { STATUS_COLOR } from "./statusStyle";
import type { DashTopic } from "./types";

interface ProgressCardProps {
  topics: DashTopic[];
  summary: DashboardSummary;
}

export default function ProgressCard({ topics, summary }: ProgressCardProps) {
  const started = startedTopics(topics);
  const statuses = started.map((topic) => getMasteryStatus(topic.masteryPct));
  const count = (status: (typeof statuses)[number]) => statuses.filter((s) => s === status).length;

  const rows = [
    { label: "Rata-rata penguasaan", value: `${summary.overallPct}%` },
    { label: "Soal dijawab", value: String(summary.questionsAnswered) },
    { label: "Streak", value: `${summary.streakDays} hari` },
  ];

  return (
    <section className="card flex flex-col p-4 sm:p-5">
      <h2 className="font-display text-base font-bold tracking-[-0.01em]!">Progres belajar</h2>
      <p className="font-display mt-2 text-xl leading-snug font-bold tracking-[-0.02em]! text-balance">
        {summary.masteredCount} dari {summary.startedCount} topik dikuasai
      </p>

      <div
        role="img"
        aria-label={`${count("mastered")} dikuasai, ${count("progress")} sedang berjalan, ${count("weak")} perlu dikuatkan`}
        className="mt-3 flex gap-1"
      >
        {statuses.map((status, index) => (
          <span
            key={started[index].id}
            className="h-2 flex-1 rounded-full"
            style={{ background: STATUS_COLOR[status] }}
          />
        ))}
      </div>

      <dl className="mt-auto divide-y divide-[var(--color-line)] pt-4">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-baseline justify-between gap-4 py-2 first:pt-0 last:pb-0">
            <dt className="text-sm text-[var(--color-muted)]">{label}</dt>
            <dd className="font-display text-base font-bold tracking-[-0.01em]! tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
