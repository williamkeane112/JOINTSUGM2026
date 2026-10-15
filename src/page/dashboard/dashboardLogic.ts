import { buildMasteryCurve, type CurvePoint } from "../../lib/algorithms/bkt";
import { MASTERY_THRESHOLDS, clampMastery, getMasteryStatus } from "../../lib/mastery";
import type { DashboardData, DashTopic, Recommendation } from "./types";

/** Topics the student has access to (not locked behind a prerequisite), in their original order. */
export function startedTopics(topics: DashTopic[]): DashTopic[] {
  return topics.filter((topic) => !topic.locked);
}

/**
 * Picks the next topic: the lowest-mastery unlocked topic that is not yet mastered.
 * Ties go to whichever comes first in the list.
 */
export function pickRecommendation(topics: DashTopic[]): Recommendation {
  const unlocked = startedTopics(topics);
  if (unlocked.length === 0) return { kind: "empty" };

  const candidates = unlocked.filter(
    (topic) => clampMastery(topic.masteryPct) < MASTERY_THRESHOLDS.mastered,
  );
  if (candidates.length === 0) return { kind: "all-mastered" };

  const lowest = candidates.reduce((best, topic) =>
    clampMastery(topic.masteryPct) < clampMastery(best.masteryPct) ? topic : best,
  );
  return { kind: "continue", topic: lowest };
}

export function summarize(data: DashboardData) {
  const started = startedTopics(data.topics);
  const total = started.reduce((sum, topic) => sum + clampMastery(topic.masteryPct), 0);

  return {
    overallPct: started.length === 0 ? 0 : Math.round(total / started.length),
    startedCount: started.length,
    masteredCount: started.filter((topic) => getMasteryStatus(topic.masteryPct) === "mastered").length,
    questionsAnswered: data.questionsAnswered,
    streakDays: data.streakDays,
  };
}

/** Single place to change once the journey route exists (e.g. `/journey/${topicId}`). */
export function topicHref(topicId: string): string {
  void topicId;
  return "/topicSelect";
}

export type DashboardSummary = ReturnType<typeof summarize>;

/** The chart shows at most this many of the latest answers, so spacing stays readable. */
export const MAX_CURVE_ANSWERS = 30;

/** Mastery curve for the recommended topic: one point per answer (the estimate after that answer), last 30 answers. */
export function curveForRecommendation(
  data: DashboardData,
  rec: Recommendation,
): { topicName: string; points: CurvePoint[] } | null {
  if (rec.kind !== "continue") return null;

  // buildMasteryCurve prepends the prior (answer 0). That is a model assumption, not an answer, so it is not plotted.
  const answerPoints = buildMasteryCurve(data.answerHistory[rec.topic.id] ?? []).slice(1);
  return { topicName: rec.topic.name, points: answerPoints.slice(-MAX_CURVE_ANSWERS) };
}

const MS_PER_DAY = 86_400_000;

/** Calendar-day distance in the viewer's timezone: "Hari ini", "Kemarin", "3 hari lalu". */
export function formatRelativeDay(iso: string | null, now: Date = new Date()): string {
  if (!iso) return "Belum pernah latihan";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Belum pernah latihan";

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(date)) / MS_PER_DAY);

  if (days <= 0) return "Hari ini";
  if (days === 1) return "Kemarin";
  return `${days} hari lalu`;
}