/**
 * Mastery thresholds, in percent (0-100).
 *   < 40        -> weak     (not mastered)
 *   40 .. < 70  -> progress (in progress)
 *   >= 70       -> mastered
 * Matches getStatus() in .kiro/steering/03-bkt-algorithm.md (p_learned < 0.7 => in progress).
 */
export type MasteryStatus = "weak" | "progress" | "mastered";

export const MASTERY_THRESHOLDS = { progress: 40, mastered: 70 } as const;

/** Limits a mastery percentage to 0-100. Non-finite input (NaN, Infinity) becomes 0. */
export function clampMastery(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function getMasteryStatus(masteryPct: number): MasteryStatus {
  const pct = clampMastery(masteryPct);
  if (pct < MASTERY_THRESHOLDS.progress) return "weak";
  if (pct < MASTERY_THRESHOLDS.mastered) return "progress";
  return "mastered";
}
