import { describe, expect, it } from "vitest";
import { BKTModel, buildMasteryCurve } from "./bkt";

describe("BKTModel.update", () => {
  it("raises mastery after a correct answer", () => {
    const model = new BKTModel({ p_learned: 0.45 });
    expect(model.update(true)).toBeCloseTo(0.7719, 3);
  });

  it("lowers mastery after a wrong answer", () => {
    const model = new BKTModel({ p_learned: 0.45 });
    expect(model.update(false)).toBeCloseTo(0.1885, 3);
  });

  it("stays finite when the evidence denominator is zero", () => {
    const model = new BKTModel({ p_learned: 0, p_guess: 0 });
    const result = model.update(true);
    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBeCloseTo(0.1, 5);
  });

  it("keeps P(L) inside 0..1 at the extremes", () => {
    const result = new BKTModel({ p_learned: 1 }).update(false);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });
});

describe("BKTModel helpers", () => {
  it("reports mastery as a percentage", () => {
    expect(new BKTModel({ p_learned: 0.42 }).getMasteryPercentage()).toBeCloseTo(42, 5);
  });

  it("maps P(L) to a status using 0.4 and 0.7", () => {
    expect(new BKTModel({ p_learned: 0.39 }).getStatus()).toBe("not_mastered");
    expect(new BKTModel({ p_learned: 0.4 }).getStatus()).toBe("in_progress");
    expect(new BKTModel({ p_learned: 0.7 }).getStatus()).toBe("mastered");
  });

  it("exposes its parameters", () => {
    expect(new BKTModel({ p_learned: 0.3 }).getParameters()).toEqual({
      p_learned: 0.3,
      p_transit: 0.1,
      p_guess: 0.25,
      p_slip: 0.1,
    });
  });
});

describe("buildMasteryCurve", () => {
  it("returns only the starting point for no answers", () => {
    const points = buildMasteryCurve([]);
    expect(points).toHaveLength(1);
    expect(points[0].answer).toBe(0);
    expect(points[0].correct).toBeNull();
    expect(points[0].masteryPct).toBeCloseTo(10, 5);
  });

  it("adds one point per answer and follows correctness", () => {
    const points = buildMasteryCurve([true, false]);
    expect(points.map((p) => p.answer)).toEqual([0, 1, 2]);
    expect(points.map((p) => p.correct)).toEqual([null, true, false]);
    expect(points[1].masteryPct).toBeGreaterThan(points[0].masteryPct);
    expect(points[2].masteryPct).toBeLessThan(points[1].masteryPct);
  });

  it("never decreases across a run of correct answers and ends mastered", () => {
    const points = buildMasteryCurve(Array.from({ length: 8 }, () => true));
    for (let i = 1; i < points.length; i += 1) {
      expect(points[i].masteryPct).toBeGreaterThanOrEqual(points[i - 1].masteryPct);
    }
    expect(points.at(-1)?.masteryPct).toBeGreaterThanOrEqual(70);
  });
});
