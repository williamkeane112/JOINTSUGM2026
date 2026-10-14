import type { MasteryStatus } from "../../lib/mastery";

/** Visible status text. Status is never conveyed by color alone. */
export const STATUS_LABEL: Record<MasteryStatus | "locked", string> = {
  weak: "Perlu dikuatkan",
  progress: "Sedang berjalan",
  mastered: "Dikuasai",
  locked: "Terkunci",
};

/** Badge classes live in src/index.css. */
export const STATUS_BADGE: Record<MasteryStatus | "locked", string> = {
  weak: "badge-not-mastered",
  progress: "badge-progress",
  mastered: "badge-mastered",
  locked: "badge-locked",
};

export const STATUS_COLOR: Record<MasteryStatus, string> = {
  weak: "var(--color-weak)",
  progress: "var(--color-progress)",
  mastered: "var(--color-mastered)",
};

export const STATUS_TINT: Record<MasteryStatus, string> = {
  weak: "var(--color-weak-tint)",
  progress: "var(--color-progress-tint)",
  mastered: "var(--color-mastered-tint)",
};

/** Shared by HeroCard and EmptyState: both occupy the dashboard's single dark surface. */
export const HERO_SURFACE =
  "rounded-[var(--radius-card)] bg-[var(--color-night)] p-6 text-[var(--color-cream)] sm:p-8";
