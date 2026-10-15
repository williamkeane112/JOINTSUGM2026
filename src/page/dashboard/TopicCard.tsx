import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { clampMastery, getMasteryStatus } from "../../lib/mastery";
import { formatRelativeDay, topicHref } from "./dashboardLogic";
import { STATUS_BADGE, STATUS_LABEL, STATUS_TINT } from "./statusStyle";
import type { DashTopic } from "./types";

const cardBase = "flex min-h-28 flex-col rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-card)]";

/** A topic the student has started. Locked topics are not listed on the dashboard (see Index). */
export default function TopicCard({ topic }: { topic: DashTopic }) {
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
      <h3 className="font-display line-clamp-2 text-base leading-snug font-bold tracking-[-0.01em]! text-[var(--color-ink)]">
        {topic.name}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="font-display text-2xl font-bold tracking-[-0.02em]! tabular-nums text-[var(--color-ink)]">
          {Math.round(pct)}%
        </span>
        <span className={`${STATUS_BADGE[status]} badge-sm`}>{STATUS_LABEL[status]}</span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
        <p className="text-xs text-[var(--color-muted)]">{formatRelativeDay(topic.lastPracticedAt)}</p>
        {/* Decorative: the whole card is the link, so the tap target is the card, not this arrow. */}
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-night)] text-[var(--color-cream)]"
        >
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
