import { ArrowRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { clampMastery, getMasteryStatus } from "../../lib/mastery";
import { formatRelativeDay, topicHref } from "./dashboardLogic";
import { STATUS_BADGE, STATUS_LABEL, STATUS_TINT } from "./statusStyle";
import type { DashTopic } from "./types";

const cardBase = "flex min-h-40 flex-col rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)]";

export default function TopicCard({ topic }: { topic: DashTopic }) {
  if (topic.locked) {
    return (
      <div aria-disabled="true" className={`${cardBase} bg-[var(--color-locked-tint)] text-[var(--color-locked-ink)]`}>
        <h3 className="font-display flex items-start gap-2 text-lg leading-snug font-bold">
          <Lock aria-hidden="true" size={18} className="mt-1 shrink-0" />
          <span className="line-clamp-2">{topic.name}</span>
        </h3>
        <p className="mt-3 text-sm">Terbuka setelah topik prasyaratnya dikuasai.</p>
        <span className={`${STATUS_BADGE.locked} mt-auto self-start px-2.5 py-0.5 text-xs`}>{STATUS_LABEL.locked}</span>
      </div>
    );
  }

  const pct = clampMastery(topic.masteryPct);
  const status = getMasteryStatus(pct);

  return (
    <Link
      to={topicHref(topic.id)}
      className={`${cardBase} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]`}
      style={{
        // Hard-stop fill: the card itself is the mastery bar.
        background: `linear-gradient(to right, ${STATUS_TINT[status]} ${pct}%, var(--color-surface) ${pct}%)`,
      }}
    >
      <h3 className="font-display line-clamp-2 text-lg leading-snug font-bold text-[var(--color-ink)]">{topic.name}</h3>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-display text-3xl font-bold tabular-nums text-[var(--color-ink)]">{Math.round(pct)}%</span>
        <span className={`${STATUS_BADGE[status]} px-2.5 py-0.5 text-xs`}>{STATUS_LABEL[status]}</span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <p className="text-xs text-[var(--color-muted)]">{formatRelativeDay(topic.lastPracticedAt)}</p>
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-night)] text-[var(--color-cream)]"
        >
          <ArrowRight size={18} />
        </span>
      </div>
    </Link>
  );
}
