import { describe, expect, it } from "vitest";
import { buildLearningPath, type PathCandidate } from "./learningPath";

interface Item extends PathCandidate {
  key: string;
}

function item(key: string, masteryPct: number, status: PathCandidate["status"]): Item {
  return { key, masteryPct, status };
}

describe("buildLearningPath", () => {
  it("skips mastered items (curriculum order) and sorts the rest by mastery ascending", () => {
    const items = [
      item("a", 80, "mastered"),
      item("b", 30, "weak"),
      item("c", 90, "mastered"),
      item("d", 55, "progress"),
      item("e", 10, "weak"),
    ];

    const path = buildLearningPath(items);

    expect(path.skipped.map((i) => i.key)).toEqual(["a", "c"]);
    expect(path.steps.map((i) => i.key)).toEqual(["e", "b", "d"]);
  });

  it("keeps curriculum order for ties in masteryPct", () => {
    const items = [
      item("a", 50, "progress"),
      item("b", 50, "progress"),
      item("c", 50, "progress"),
    ];

    const path = buildLearningPath(items);

    expect(path.steps.map((i) => i.key)).toEqual(["a", "b", "c"]);
  });

  it("returns an empty steps array when everything is mastered", () => {
    const items = [item("a", 80, "mastered"), item("b", 95, "mastered")];

    const path = buildLearningPath(items);

    expect(path.skipped.map((i) => i.key)).toEqual(["a", "b"]);
    expect(path.steps).toEqual([]);
  });

  it("handles empty input", () => {
    const path = buildLearningPath([]);

    expect(path.skipped).toEqual([]);
    expect(path.steps).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const items = [
      item("a", 80, "mastered"),
      item("b", 30, "weak"),
      item("c", 10, "weak"),
    ];
    const snapshot = structuredClone(items);

    buildLearningPath(items);

    expect(items).toEqual(snapshot);
  });
});
