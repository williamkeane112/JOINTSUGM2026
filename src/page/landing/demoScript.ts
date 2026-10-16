/**
 * Scripted BKT demo for the landing page ("Raka" persona).
 *
 * Pure, no React: computes a fixed set of skill results from a fixed set of
 * answers, then derives a demo learning path (skipped vs. ordered steps).
 * Mirrors the real BKT model so the landing page demo matches production
 * behaviour, but every answer here is hardcoded for a reproducible demo.
 */

import { BKTModel } from "../../lib/algorithms/bkt";
import { getMasteryStatus, type MasteryStatus } from "../../lib/mastery";

export type SkillKey = "variabel" | "kondisi" | "perulangan" | "fungsi";

export interface DemoQuestion {
  prompt: string;
  code: string;
  options: readonly string[];
  correct: string;
  chosen: string;
}

export interface DemoSkill {
  key: SkillKey;
  name: string;
  question: DemoQuestion;
}

export interface SkillResult {
  key: SkillKey;
  name: string;
  correct: boolean;
  masteryPct: number;
  status: MasteryStatus;
}

export interface DemoPath {
  skipped: SkillResult[];
  steps: SkillResult[];
}

/** Starting P(L) for every skill in the demo (not the real app's prior). */
export const DEMO_PRIOR = 0.5;

/** 0 = topik dipilih, 1..4 = soal ke-n dijawab, 5 = jalur akhir. */
export const DEMO_FRAME_COUNT = 6;

export const DEMO_SKILLS: readonly DemoSkill[] = [
  {
    key: "variabel",
    name: "Variabel",
    question: {
      prompt: "Apa yang dicetak?",
      code: "x = 5\nx = x + 2\nprint(x)",
      options: ["5", "7", "52", "Error"],
      correct: "7",
      chosen: "7",
    },
  },
  {
    key: "kondisi",
    name: "Kondisi",
    question: {
      prompt: "Apa yang dicetak?",
      code: 'nilai = 75\nif nilai >= 70:\n    print("Lulus")\nelse:\n    print("Ulang")',
      options: ["Lulus", "Ulang", "Lulus Ulang", "Error"],
      correct: "Lulus",
      chosen: "Lulus",
    },
  },
  {
    key: "perulangan",
    name: "Perulangan",
    question: {
      prompt: "Apa yang dicetak?",
      code: "for i in range(3):\n    print(i)",
      options: ["0 1 2", "1 2 3", "0 1 2 3", "3"],
      correct: "0 1 2",
      chosen: "1 2 3",
    },
  },
  {
    key: "fungsi",
    name: "Fungsi",
    question: {
      prompt: "Apa hasil dobel(4)?",
      code: "def dobel(n):\n    return n * 2\n\nprint(dobel(4))",
      options: ["8", "4", "44", "None"],
      correct: "8",
      chosen: "4",
    },
  },
];

/** Derived from DEMO_SKILLS: whether each scripted answer is correct. */
export const RAKA_ANSWERS: readonly boolean[] = DEMO_SKILLS.map(
  (skill) => skill.question.chosen === skill.question.correct,
);

/**
 * Runs each skill through a fresh BKTModel (prior DEMO_PRIOR) with the
 * matching answer. Models are never reused/chained across skills: every
 * skill's mastery depends only on its own single answer.
 */
export function computeSkillResults(
  skills: readonly DemoSkill[],
  answers: readonly boolean[],
): SkillResult[] {
  if (answers.length !== skills.length) {
    throw new Error(
      `computeSkillResults: expected ${skills.length} answers, got ${answers.length}`,
    );
  }

  return skills.map((skill, index) => {
    const model = new BKTModel({ p_learned: DEMO_PRIOR });
    model.update(answers[index]);
    const masteryPct = Math.round(model.getMasteryPercentage());

    return {
      key: skill.key,
      name: skill.name,
      correct: answers[index],
      masteryPct,
      status: getMasteryStatus(masteryPct),
    };
  });
}

/**
 * Splits results into skills already mastered (skipped, curriculum order)
 * and the rest (steps), ordered by mastery ascending with curriculum order
 * as the tiebreaker.
 */
export function buildDemoPath(results: readonly SkillResult[]): DemoPath {
  const skipped = results.filter((result) => result.status === "mastered");
  const steps = results
    .filter((result) => result.status !== "mastered")
    .map((result, index) => ({ result, index }))
    .sort((a, b) => a.result.masteryPct - b.result.masteryPct || a.index - b.index)
    .map(({ result }) => result);

  return { skipped, steps };
}
