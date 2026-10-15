import { describe, expect, it } from "vitest";
import {
  DEFAULT_DIAGNOSTIC_RULES,
  answerQuestion,
  getResults,
  isDiagnosticDone,
  isSkillDone,
  nextQuestion,
  startDiagnostic,
  type BankQuestion,
  type DiagnosticSkill,
  type DiagnosticState,
} from "./diagnostic";

function makeSkills(count: number): DiagnosticSkill[] {
  return Array.from({ length: count }, (_, i) => ({
    key: `s${i + 1}`,
    name: `Skill ${i + 1}`,
  }));
}

function makeBank(skills: readonly DiagnosticSkill[], perSkill: number): BankQuestion[] {
  return skills.flatMap((skill) =>
    Array.from({ length: perSkill }, (_, i) => ({
      id: `${skill.key}-q${i + 1}`,
      skillKey: skill.key,
    })),
  );
}

/**
 * Drives a session to completion. `decide` receives the chosen question and
 * how many questions were already asked for its skill before this one
 * (0-based), and returns whether to answer it correctly.
 */
function run(
  initial: DiagnosticState,
  decide: (question: BankQuestion, nthForSkill: number) => boolean,
): { state: DiagnosticState; asked: BankQuestion[] } {
  let state = initial;
  const asked: BankQuestion[] = [];

  for (;;) {
    const question = nextQuestion(state);
    if (!question) break;
    const nthForSkill = state.progress[question.skillKey].askedIds.length;
    asked.push(question);
    state = answerQuestion(state, question.id, decide(question, nthForSkill));
  }

  return { state, asked };
}

describe("nextQuestion interleaving", () => {
  it("asks one question per skill in curriculum order before repeating any skill", () => {
    const skills = makeSkills(4);
    const bank = makeBank(skills, 8);
    const initial = startDiagnostic(skills, bank);

    const { asked } = run(initial, () => true);

    expect(asked.slice(0, 4).map((q) => q.skillKey)).toEqual(["s1", "s2", "s3", "s4"]);
    expect(asked[4].skillKey).toBe("s1");
  });
});

describe("all correct", () => {
  it("stops each skill at 2 questions, confidently mastered", () => {
    const skills = makeSkills(4);
    const bank = makeBank(skills, 8);
    const initial = startDiagnostic(skills, bank);

    const { state } = run(initial, () => true);
    const results = getResults(state);

    for (const skill of results.skills) {
      expect(skill.masteryPct).toBe(94);
      expect(skill.asked).toBe(2);
      expect(skill.confident).toBe(true);
      expect(skill.status).toBe("mastered");
    }
    expect(results.totalAnswered).toBe(8);
    expect(results.finished).toBe(true);
  });
});

describe("all wrong", () => {
  it("stops each skill at 2 questions, confidently not mastered", () => {
    const skills = makeSkills(4);
    const bank = makeBank(skills, 8);
    const initial = startDiagnostic(skills, bank);

    const { state } = run(initial, () => false);
    const results = getResults(state);

    for (const skill of results.skills) {
      expect(skill.masteryPct).toBe(13);
      expect(skill.asked).toBe(2);
      expect(skill.confident).toBe(true);
    }
  });
});

describe("uncertain skill", () => {
  it("keeps asking when correct-then-wrong lands in the middle", () => {
    const skills = makeSkills(1);
    const bank = makeBank(skills, 8);
    const initial = startDiagnostic(skills, bank);

    let state = initial;
    const q1 = nextQuestion(state);
    state = answerQuestion(state, q1!.id, true);
    const q2 = nextQuestion(state);
    state = answerQuestion(state, q2!.id, false);

    const results = getResults(state);
    expect(results.skills[0].masteryPct).toBe(42);
    expect(isSkillDone(state, "s1")).toBe(false);
    expect(isDiagnosticDone(state)).toBe(false);

    const q3 = nextQuestion(state);
    expect(q3).not.toBeNull();
    expect(q3!.skillKey).toBe("s1");
  });
});

describe("max per skill", () => {
  it("stops at the hard cap even if the skill never becomes confident", () => {
    const skills = makeSkills(3);
    const bank = makeBank(skills, 6);
    const initial = startDiagnostic(skills, bank);

    const { state } = run(initial, (_q, nth) => nth % 2 === 0);
    const results = getResults(state);

    for (const skill of results.skills) {
      expect(skill.asked).toBe(4);
      expect(skill.confident).toBe(false);
    }
  });
});

describe("max total", () => {
  it("stops the whole session at the question cap, mid skill", () => {
    const skills = makeSkills(6);
    const bank = makeBank(skills, 8);
    const initial = startDiagnostic(skills, bank);

    const { state } = run(initial, (_q, nth) => nth % 2 === 0);
    const results = getResults(state);

    expect(results.totalAnswered).toBe(20);
    expect(results.finished).toBe(true);

    const askedByKey = new Map(results.skills.map((s) => [s.key, s.asked]));
    expect(askedByKey.get("s1")).toBe(4);
    expect(askedByKey.get("s2")).toBe(4);
    expect(askedByKey.get("s3")).toBe(3);
    expect(askedByKey.get("s4")).toBe(3);
    expect(askedByKey.get("s5")).toBe(3);
    expect(askedByKey.get("s6")).toBe(3);
  });
});

describe("bank exhausted", () => {
  it("finishes a skill early when its question bank runs out, and never asks a skill with no questions", () => {
    const skills: DiagnosticSkill[] = [
      { key: "a", name: "A" },
      { key: "b", name: "B" },
    ];
    const bank: BankQuestion[] = [{ id: "a-q1", skillKey: "a" }];
    const initial = startDiagnostic(skills, bank);

    expect(() => run(initial, () => true)).not.toThrow();
    const { state } = run(initial, () => true);
    const results = getResults(state);

    const byKey = new Map(results.skills.map((s) => [s.key, s]));
    expect(byKey.get("a")?.asked).toBe(1);
    expect(byKey.get("b")?.asked).toBe(0);
    expect(byKey.get("b")?.masteryPct).toBe(50);
    expect(results.finished).toBe(true);
  });
});

describe("answerQuestion guards", () => {
  it("throws when the id does not match the engine's chosen question", () => {
    const skills = makeSkills(1);
    const bank = makeBank(skills, 2);
    const state = startDiagnostic(skills, bank);

    expect(() => answerQuestion(state, "not-a-real-id", true)).toThrow();
  });

  it("throws once the session is done", () => {
    const skills = makeSkills(1);
    const bank = makeBank(skills, 2);
    const initial = startDiagnostic(skills, bank, { maxPerSkill: 1 });

    const q1 = nextQuestion(initial);
    const afterOne = answerQuestion(initial, q1!.id, true);
    expect(isDiagnosticDone(afterOne)).toBe(true);
    expect(() => answerQuestion(afterOne, q1!.id, true)).toThrow();
  });

  it("never mutates the input state", () => {
    const skills = makeSkills(2);
    const bank = makeBank(skills, 4);
    const state = startDiagnostic(skills, bank);
    const snapshot = structuredClone(state);

    const q1 = nextQuestion(state);
    answerQuestion(state, q1!.id, true);

    expect(state).toEqual(snapshot);
  });
});

describe("startDiagnostic validation", () => {
  it("throws for an empty skill list", () => {
    expect(() => startDiagnostic([], [])).toThrow();
  });

  it("throws for duplicate skill keys", () => {
    const skills: DiagnosticSkill[] = [
      { key: "a", name: "A" },
      { key: "a", name: "A again" },
    ];
    expect(() => startDiagnostic(skills, [])).toThrow();
  });

  it("throws for duplicate question ids", () => {
    const skills: DiagnosticSkill[] = [{ key: "a", name: "A" }];
    const bank: BankQuestion[] = [
      { id: "dup", skillKey: "a" },
      { id: "dup", skillKey: "a" },
    ];
    expect(() => startDiagnostic(skills, bank)).toThrow();
  });

  it("throws when a question references an unknown skill", () => {
    const skills: DiagnosticSkill[] = [{ key: "a", name: "A" }];
    const bank: BankQuestion[] = [{ id: "q1", skillKey: "unknown" }];
    expect(() => startDiagnostic(skills, bank)).toThrow();
  });
});

describe("getResults path", () => {
  it("puts confidently-mastered skills in skipped, the rest in steps ascending", () => {
    const skills: DiagnosticSkill[] = [
      { key: "weak1", name: "Weak 1" },
      { key: "strong1", name: "Strong 1" },
      { key: "weak2", name: "Weak 2" },
      { key: "strong2", name: "Strong 2" },
    ];
    const bank = makeBank(skills, 4);
    const initial = startDiagnostic(skills, bank);

    const { state } = run(initial, (q) => q.skillKey.startsWith("strong"));
    const results = getResults(state);

    expect(results.path.skipped.map((s) => s.key)).toEqual(["strong1", "strong2"]);
    expect(results.path.steps.map((s) => s.key)).toEqual(["weak1", "weak2"]);
  });
});

describe("custom rules", () => {
  it("respects a Partial<DiagnosticRules> override", () => {
    const skills = makeSkills(6);
    const bank = makeBank(skills, 8);
    const initial = startDiagnostic(skills, bank, { maxTotal: 3 });

    expect(initial.rules).toEqual({ ...DEFAULT_DIAGNOSTIC_RULES, maxTotal: 3 });

    const { state } = run(initial, () => true);
    const results = getResults(state);

    expect(results.totalAnswered).toBe(3);
    expect(results.finished).toBe(true);
  });
});
