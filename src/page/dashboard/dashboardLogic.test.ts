import { describe, expect, it } from "vitest";
import { buildMasteryCurve } from "../../lib/algorithms/bkt";
import { QUESTIONS_PER_SET, getMockDashboard } from "./mockData";
import {
  MAX_CURVE_ANSWERS,
  curveForRecommendation,
  formatRelativeDay,
  pickRecommendation,
  summarize,
  topicHref,
} from "./dashboardLogic";
import type { DashboardData, DashTopic } from "../../lib/dashboard/types";

const topic = (overrides: Partial<DashTopic> & Pick<DashTopic, "id">): DashTopic => ({
  name: overrides.id,
  masteryPct: 50,
  locked: false,
  lastPracticedAt: null,
  ...overrides,
});

const data = (topics: DashTopic[], answerHistory: Record<string, boolean[]> = {}): DashboardData => ({
  studentName: "Tes",
  topics,
  questionsAnswered: 12,
  streakDays: 3,
  answerHistory,
});

describe("pickRecommendation", () => {
  it("returns empty for no topics", () => {
    expect(pickRecommendation([])).toEqual({ kind: "empty" });
  });

  it("returns empty when every topic is locked", () => {
    expect(pickRecommendation([topic({ id: "a", locked: true })])).toEqual({ kind: "empty" });
  });

  it("picks the lowest-mastery unlocked topic below 70 and ignores locked ones", () => {
    const result = pickRecommendation([
      topic({ id: "locked-low", masteryPct: 5, locked: true }),
      topic({ id: "mid", masteryPct: 55 }),
      topic({ id: "low", masteryPct: 30 }),
      topic({ id: "done", masteryPct: 90 }),
    ]);
    expect(result).toMatchObject({ kind: "continue", topic: { id: "low" } });
  });

  it("breaks ties by list order", () => {
    const result = pickRecommendation([
      topic({ id: "first", masteryPct: 20 }),
      topic({ id: "second", masteryPct: 20 }),
    ]);
    expect(result).toMatchObject({ kind: "continue", topic: { id: "first" } });
  });

  it("returns all-mastered when every unlocked topic is at least 70", () => {
    const result = pickRecommendation([
      topic({ id: "a", masteryPct: 70 }),
      topic({ id: "b", masteryPct: 100 }),
    ]);
    expect(result).toEqual({ kind: "all-mastered" });
  });
});

describe("summarize", () => {
  it("returns zeros, not NaN, for an empty topic list", () => {
    const result = summarize(data([]));
    expect(result.overallPct).toBe(0);
    expect(result.startedCount).toBe(0);
    expect(result.masteredCount).toBe(0);
  });

  it("averages clamped mastery of unlocked topics and ignores locked ones", () => {
    const result = summarize(
      data([
        topic({ id: "a", masteryPct: 140 }), // clamped to 100
        topic({ id: "b", masteryPct: 50 }),
        topic({ id: "c", masteryPct: 0, locked: true }),
      ]),
    );
    expect(result.overallPct).toBe(75);
    expect(result.startedCount).toBe(2);
    expect(result.masteredCount).toBe(1);
  });

  it("passes through questionsAnswered and streakDays", () => {
    const result = summarize(data([topic({ id: "a" })]));
    expect(result.questionsAnswered).toBe(12);
    expect(result.streakDays).toBe(3);
  });
});

describe("topicHref", () => {
  it("points to /topicSelect until the journey route exists", () => {
    expect(topicHref("any-id")).toBe("/topicSelect");
  });
});

describe("getMockDashboard", () => {
  const recommendedId = (scenario: string | null) => {
    const rec = pickRecommendation(getMockDashboard(scenario).topics);
    return rec.kind === "continue" ? rec.topic.id : rec.kind;
  };

  it("gives budi and sari different recommendations", () => {
    expect(recommendedId("budi")).not.toBe(recommendedId("sari"));
    expect(recommendedId("budi")).not.toBe("empty");
    expect(recommendedId("sari")).not.toBe("empty");
  });

  it("budi has weak, in-progress, mastered and locked topics", () => {
    const topics = getMockDashboard("budi").topics;
    expect(topics.some((t) => t.locked)).toBe(true);
    expect(topics.some((t) => !t.locked && t.masteryPct < 40)).toBe(true);
    expect(topics.some((t) => !t.locked && t.masteryPct >= 40 && t.masteryPct < 70)).toBe(true);
    expect(topics.some((t) => !t.locked && t.masteryPct >= 70)).toBe(true);
  });

  it("supports the empty and done scenarios", () => {
    expect(pickRecommendation(getMockDashboard("empty").topics)).toEqual({ kind: "empty" });
    expect(pickRecommendation(getMockDashboard("done").topics)).toEqual({ kind: "all-mastered" });
  });

  it("falls back to budi for null or unknown scenarios", () => {
    expect(getMockDashboard(null)).toEqual(getMockDashboard("budi"));
    expect(getMockDashboard("nope")).toEqual(getMockDashboard("budi"));
  });
});

describe("curveForRecommendation", () => {
  it("returns null unless the recommendation is continue", () => {
    expect(curveForRecommendation(data([]), { kind: "empty" })).toBeNull();
    expect(curveForRecommendation(data([]), { kind: "all-mastered" })).toBeNull();
  });

  it("returns no points when the topic has no history", () => {
    const t = topic({ id: "a", name: "Pecahan" });
    const curve = curveForRecommendation(data([t]), { kind: "continue", topic: t });
    expect(curve?.topicName).toBe("Pecahan");
    expect(curve?.points).toHaveLength(0);
  });

  it("plots exactly one point per answer, starting from answer 1", () => {
    const t = topic({ id: "a" });
    const answers = [true, false, true, true, false, true, false, false, true, true];
    const curve = curveForRecommendation(data([t], { a: answers }), { kind: "continue", topic: t });

    expect(curve?.points).toHaveLength(10);
    expect(curve?.points.map((p) => p.answer)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(curve?.points.map((p) => p.correct)).toEqual(answers);
  });

  it("keeps only the last 30 answers of a long history", () => {
    const t = topic({ id: "a" });
    const answers = Array.from({ length: 100 }, (_, i) => i % 3 !== 0);
    const curve = curveForRecommendation(data([t], { a: answers }), { kind: "continue", topic: t });
    const full = buildMasteryCurve(answers);

    expect(MAX_CURVE_ANSWERS).toBe(30);
    expect(curve?.points).toHaveLength(MAX_CURVE_ANSWERS);
    expect(curve?.points[0].answer).toBe(71);
    expect(curve?.points.at(-1)).toEqual(full.at(-1));
  });

  it.each(["budi", "sari"])("ends at the hero topic mastery for %s", (scenario) => {
    const mock = getMockDashboard(scenario);
    const rec = pickRecommendation(mock.topics);
    if (rec.kind !== "continue") throw new Error("expected a continue recommendation");

    const curve = curveForRecommendation(mock, rec);
    expect(Math.round(curve?.points.at(-1)?.masteryPct ?? -1)).toBe(Math.round(rec.topic.masteryPct));
  });

  it("has no curve for the empty and done scenarios", () => {
    for (const scenario of ["empty", "done"]) {
      const mock = getMockDashboard(scenario);
      expect(curveForRecommendation(mock, pickRecommendation(mock.topics))).toBeNull();
    }
  });
});

describe("formatRelativeDay", () => {
  // Built from local components so the calendar-day math is timezone independent.
  const local = (day: number, hour: number, minute = 0) => new Date(2026, 9, day, hour, minute).toISOString();
  const now = new Date(2026, 9, 14, 12);

  it("handles missing and invalid dates", () => {
    expect(formatRelativeDay(null, now)).toBe("Belum pernah latihan");
    expect(formatRelativeDay("bukan-tanggal", now)).toBe("Belum pernah latihan");
  });

  it("formats today, yesterday and older days", () => {
    expect(formatRelativeDay(local(14, 7), now)).toBe("Hari ini");
    expect(formatRelativeDay(local(13, 23, 30), now)).toBe("Kemarin");
    expect(formatRelativeDay(local(11, 9), now)).toBe("3 hari lalu");
  });

  it("treats future dates as today", () => {
    expect(formatRelativeDay(local(15, 9), now)).toBe("Hari ini");
  });
});

describe("mock data completeness", () => {
  it.each(["budi", "sari", "done"])("%s only has complete sets of answers per topic", (scenario) => {
    const histories = Object.values(getMockDashboard(scenario).answerHistory);
    expect(histories.length).toBeGreaterThan(0);
    for (const answers of histories) {
      expect(answers.length).toBeGreaterThan(0);
      expect(answers.length % QUESTIONS_PER_SET).toBe(0);
    }
  });

  it.each(["budi", "sari", "empty", "done"])("%s: questionsAnswered equals the answers on record", (scenario) => {
    const mock = getMockDashboard(scenario);
    const total = Object.values(mock.answerHistory).reduce((sum, answers) => sum + answers.length, 0);
    expect(mock.questionsAnswered).toBe(total);
  });
});