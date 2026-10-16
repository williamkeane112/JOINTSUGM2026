import { describe, expect, it } from "vitest";
import {
  DEMO_SKILLS,
  RAKA_ANSWERS,
  buildDemoPath,
  computeSkillResults,
} from "./demoScript";

describe("RAKA_ANSWERS", () => {
  it("matches chosen vs. correct for each scripted skill", () => {
    expect(RAKA_ANSWERS).toEqual([true, true, false, false]);
  });
});

describe("computeSkillResults", () => {
  it("computes mastery and status for the scripted Raka answers", () => {
    const results = computeSkillResults(DEMO_SKILLS, RAKA_ANSWERS);
    expect(results.map((r) => r.masteryPct)).toEqual([80, 80, 21, 21]);
    expect(results.map((r) => r.status)).toEqual([
      "mastered",
      "mastered",
      "weak",
      "weak",
    ]);
  });

  it("uses a fresh model per skill (no chaining across skills)", () => {
    const allTrue = DEMO_SKILLS.map(() => true);
    const results = computeSkillResults(DEMO_SKILLS, allTrue);
    expect(results.map((r) => r.masteryPct)).toEqual([80, 80, 80, 80]);
  });

  it("throws when answers length does not match skills length", () => {
    expect(() => computeSkillResults(DEMO_SKILLS, [true, false])).toThrow();
  });
});

describe("buildDemoPath", () => {
  it("skips mastered skills (curriculum order) and orders the rest by mastery", () => {
    const results = computeSkillResults(DEMO_SKILLS, RAKA_ANSWERS);
    const path = buildDemoPath(results);
    expect(path.skipped.map((r) => r.key)).toEqual(["variabel", "kondisi"]);
    expect(path.steps.map((r) => r.key)).toEqual(["perulangan", "fungsi"]);
  });

  it("skips nothing when every answer is wrong", () => {
    const allFalse = DEMO_SKILLS.map(() => false);
    const results = computeSkillResults(DEMO_SKILLS, allFalse);
    const path = buildDemoPath(results);
    expect(path.skipped).toEqual([]);
    expect(path.steps.map((r) => r.key)).toEqual([
      "variabel",
      "kondisi",
      "perulangan",
      "fungsi",
    ]);
  });
});

describe("DEMO_SKILLS question data", () => {
  it("has chosen and correct within options, and no duplicate options", () => {
    for (const skill of DEMO_SKILLS) {
      const { options, correct, chosen } = skill.question;
      expect(options).toContain(correct);
      expect(options).toContain(chosen);
      expect(new Set(options).size).toBe(options.length);
    }
  });
});
