import { Check } from "lucide-react";
import { STATUS_BADGE, STATUS_LABEL } from "../../components/LandingPage/statusStyle";
import type { DemoPath } from "./demoScript";

const ROW_HEIGHT = 56;
const ROW_GAP = 8;

/**
 * Learning path: steps to study first (weakest on top), skipped skills below.
 * DOM order equals visual order; rows keep their identity (keyed by skill), so a
 * re-ordered path slides each row to its new place instead of jumping.
 */
export default function SkillPathList({ path, label }: { path: DemoPath; label: string }) {
  const ordered = [...path.steps, ...path.skipped];
  const height = ordered.length * ROW_HEIGHT + Math.max(0, ordered.length - 1) * ROW_GAP;

  return (
    <ol aria-label={label} className="relative" style={{ height }}>
      {ordered.map((skill, index) => {
        const stepNumber = index < path.steps.length ? index + 1 : null;
        return (
          <li
            key={skill.key}
            className={`absolute inset-x-0 flex items-center gap-3 rounded-xl px-3 transition-[top,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              stepNumber
                ? "bg-white shadow-[0_2px_10px_rgba(23,17,31,0.07)] ring-1 ring-[var(--color-line)]"
                : "bg-[var(--color-mastered-tint)]/60"
            }`}
            style={{ top: index * (ROW_HEIGHT + ROW_GAP), height: ROW_HEIGHT }}
          >
            {stepNumber ? (
              <span className="font-display grid size-7 shrink-0 place-items-center rounded-full bg-[var(--color-night)] text-xs font-bold text-[var(--color-cream)]">
                {stepNumber}
              </span>
            ) : (
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--color-mastered)] text-white">
                <Check aria-hidden="true" size={14} strokeWidth={3} />
              </span>
            )}
            <span
              className={`min-w-0 flex-1 truncate text-sm font-semibold ${
                stepNumber ? "" : "text-[var(--color-muted)] line-through decoration-[var(--color-mastered)]/70"
              }`}
            >
              {skill.name}
            </span>
            {stepNumber ? (
              <span className={`${STATUS_BADGE[skill.status]} badge-sm shrink-0`}>{STATUS_LABEL[skill.status]}</span>
            ) : (
              <span className="badge-mastered badge-sm shrink-0">Dilewati</span>
            )}
            <span className="sr-only">{stepNumber ? `, langkah ${stepNumber}` : ", sudah dikuasai"}</span>
          </li>
        );
      })}
    </ol>
  );
}
