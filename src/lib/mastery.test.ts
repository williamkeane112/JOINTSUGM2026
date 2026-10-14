import { describe, expect, it } from "vitest";
import { clampMastery, getMasteryStatus } from "./mastery";

describe("getMasteryStatus", () => {
  it.each([
    [0, "weak"],
    [39.99, "weak"],
    [40, "progress"],
    [69.99, "progress"],
    [70, "mastered"],
    [100, "mastered"],
  ] as const)("maps %s%% to %s", (pct, expected) => {
    expect(getMasteryStatus(pct)).toBe(expected);
  });

  it("treats NaN as weak", () => {
    expect(getMasteryStatus(NaN)).toBe("weak");
  });

  it("clamps out-of-range values before classifying", () => {
    expect(getMasteryStatus(140)).toBe("mastered");
    expect(getMasteryStatus(-20)).toBe("weak");
  });
});

describe("clampMastery", () => {
  it("returns 0 for non-finite values", () => {
    expect(clampMastery(NaN)).toBe(0);
    expect(clampMastery(Infinity)).toBe(0);
  });

  it("limits values to the 0-100 range", () => {
    expect(clampMastery(-5)).toBe(0);
    expect(clampMastery(140)).toBe(100);
  });

  it("keeps in-range values untouched", () => {
    expect(clampMastery(55.5)).toBe(55.5);
  });
});
