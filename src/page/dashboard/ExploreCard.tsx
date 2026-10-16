import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Last slot of the topic grid: an invitation to pick another topic, not a topic itself.
 * Dashed outline and no fill keep it from reading as a 0% topic card.
 */
export default function ExploreCard() {
  return (
    <Link
      to="/topicSelect"
      className="flex min-h-28 flex-col rounded-[var(--radius-card)] border-2 border-dashed border-[var(--color-line)] p-4 text-[var(--color-ink)] transition-colors hover:border-[var(--color-pink)] hover:bg-[var(--color-surface)]"
    >
      <h3 className="font-display text-base leading-snug font-bold tracking-[-0.01em]!">Jelajahi topik</h3>
      <p className="mt-1 text-xs text-[var(--color-muted)]">Mulai topik baru</p>

      <div className="mt-auto flex justify-end pt-3">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-pink-deep)] ring-1 ring-[var(--color-line)]"
        >
          <Plus size={16} />
        </span>
      </div>
    </Link>
  );
}
