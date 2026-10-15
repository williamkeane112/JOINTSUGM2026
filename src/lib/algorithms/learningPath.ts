/**
 * Generic "learning path" ordering, shared by the diagnostic engine and the
 * landing-page demo so both use one rule for which skills to skip and in
 * which order to present the rest.
 *
 * Pure, no side effects: never mutates the input array.
 */

import type { MasteryStatus } from "../mastery";

/** Minimal shape required to decide skip/order; concrete callers add more fields. */
export interface PathCandidate {
  masteryPct: number;
  status: MasteryStatus;
}

export interface LearningPath<T extends PathCandidate> {
  /** Items already mastered, kept in curriculum (input) order. */
  skipped: T[];
  /** The rest, ordered by masteryPct ascending; ties keep curriculum order. */
  steps: T[];
}

/**
 * Splits `items` into `skipped` (status `"mastered"`, curriculum order) and
 * `steps` (everything else, sorted by masteryPct ascending with curriculum
 * order as a stable tiebreaker). Does not mutate `items`.
 */
export function buildLearningPath<T extends PathCandidate>(
  items: readonly T[],
): LearningPath<T> {
  const skipped = items.filter((item) => item.status === "mastered");

  const steps = items
    .filter((item) => item.status !== "mastered")
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.masteryPct - b.item.masteryPct || a.index - b.index)
    .map(({ item }) => item);

  return { skipped, steps };
}
