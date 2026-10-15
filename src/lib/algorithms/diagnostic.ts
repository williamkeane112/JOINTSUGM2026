/**
 * Adaptive diagnostic session engine — picks the next question, decides
 * when a skill (and the whole session) is "done", and produces a
 * per-skill mastery result plus a learning path from the answers given.
 *
 * Pure, immutable: every function returns new data, never mutates its
 * input `DiagnosticState`. No React, no Supabase, no I/O.
 *
 * Spec: .kiro/steering/01-mvp-scope.md §1 ("Diagnostic Test") and the
 * "Diagnostic adaptif: keputusan (2026-10-15)" note in
 * .kiro/steering/session-progress.md.
 *
 * Two different thresholds matter here and must not be confused:
 * - `stopHigh`/`stopLow` (0.85 / 0.20 by default) are *certainty*
 *   thresholds: how sure the engine must be before it stops asking a
 *   skill. They live in `DiagnosticRules`.
 * - The 40/70 thresholds in `../mastery.ts` are *UI* thresholds that turn
 *   a mastery percentage into the weak/progress/mastered label shown to
 *   the student. A skill can be "done" (confident) while still showing
 *   as "progress" in the UI, and vice versa.
 */

import { BKTModel } from "./bkt";
import { getMasteryStatus, type MasteryStatus } from "../mastery";
import { buildLearningPath, type LearningPath } from "./learningPath";

/** One skill in a topic's curriculum. Array order = curriculum order. */
export interface DiagnosticSkill {
  key: string;
  name: string;
}

/** One bank question. Array order = the order questions are used within their skill. */
export interface BankQuestion {
  id: string;
  skillKey: string;
}

/** Tunable rules for a diagnostic session. See DEFAULT_DIAGNOSTIC_RULES for the production values. */
export interface DiagnosticRules {
  /** Starting P(L) for every skill (0-1). */
  prior: number;
  /** Minimum questions asked per skill before an early stop is allowed. */
  minPerSkill: number;
  /** Hard cap on questions asked per skill, regardless of confidence. */
  maxPerSkill: number;
  /** Hard cap on questions asked across the whole session. */
  maxTotal: number;
  /** P(L) at or above this is "confidently mastered"; stop asking the skill. */
  stopHigh: number;
  /** P(L) at or below this is "confidently not mastered"; stop asking the skill. */
  stopLow: number;
}

export const DEFAULT_DIAGNOSTIC_RULES: DiagnosticRules = {
  prior: 0.5,
  minPerSkill: 2,
  maxPerSkill: 4,
  maxTotal: 20,
  stopHigh: 0.85,
  stopLow: 0.2,
};

/** One recorded answer in the session history. */
export interface DiagnosticAnswer {
  questionId: string;
  skillKey: string;
  isCorrect: boolean;
}

/** Running BKT state for a single skill within the session. */
export interface SkillProgress {
  pLearned: number;
  askedIds: readonly string[];
  correctCount: number;
}

/** Immutable snapshot of a diagnostic session at a point in time. */
export interface DiagnosticState {
  readonly skills: readonly DiagnosticSkill[];
  readonly bank: readonly BankQuestion[];
  readonly rules: DiagnosticRules;
  readonly progress: Readonly<Record<string, SkillProgress>>;
  readonly history: readonly DiagnosticAnswer[];
}

/** Final mastery result for one skill, ready for the learning path / UI. */
export interface SkillResult {
  key: string;
  name: string;
  masteryPct: number;
  status: MasteryStatus;
  asked: number;
  correct: number;
  /** True once the skill hit a certainty threshold (stopHigh/stopLow), not just the UI status. */
  confident: boolean;
}

export interface DiagnosticResults {
  finished: boolean;
  totalAnswered: number;
  skills: SkillResult[];
  path: LearningPath<SkillResult>;
}

/**
 * Starts a new diagnostic session: every skill begins at `rules.prior`
 * with no questions asked yet.
 *
 * Throws if `skills` is empty, contains duplicate keys, if `bank` has
 * duplicate question ids, or if a bank question references a skill key
 * that isn't in `skills`.
 */
export function startDiagnostic(
  skills: readonly DiagnosticSkill[],
  bank: readonly BankQuestion[],
  rules: Partial<DiagnosticRules> = {},
): DiagnosticState {
  if (skills.length === 0) {
    throw new Error("startDiagnostic: skills must not be empty");
  }

  const skillKeys = new Set<string>();
  for (const skill of skills) {
    if (skillKeys.has(skill.key)) {
      throw new Error(`startDiagnostic: duplicate skill key "${skill.key}"`);
    }
    skillKeys.add(skill.key);
  }

  const questionIds = new Set<string>();
  for (const question of bank) {
    if (questionIds.has(question.id)) {
      throw new Error(`startDiagnostic: duplicate question id "${question.id}"`);
    }
    questionIds.add(question.id);

    if (!skillKeys.has(question.skillKey)) {
      throw new Error(
        `startDiagnostic: question "${question.id}" references unknown skill "${question.skillKey}"`,
      );
    }
  }

  const mergedRules: DiagnosticRules = { ...DEFAULT_DIAGNOSTIC_RULES, ...rules };

  const progress: Record<string, SkillProgress> = {};
  for (const skill of skills) {
    progress[skill.key] = { pLearned: mergedRules.prior, askedIds: [], correctCount: 0 };
  }

  return { skills, bank, rules: mergedRules, progress, history: [] };
}

/**
 * True once a skill should stop receiving questions: it hit the hard cap
 * on questions asked, there's no unused bank question left for it, or
 * (after the minimum) its P(L) is confidently high or low.
 */
export function isSkillDone(state: DiagnosticState, skillKey: string): boolean {
  const progress = state.progress[skillKey];
  const asked = progress.askedIds.length;

  if (asked >= state.rules.maxPerSkill) {
    return true;
  }

  const hasUnusedQuestion = state.bank.some(
    (question) => question.skillKey === skillKey && !progress.askedIds.includes(question.id),
  );
  if (!hasUnusedQuestion) {
    return true;
  }

  if (
    asked >= state.rules.minPerSkill &&
    (progress.pLearned >= state.rules.stopHigh || progress.pLearned <= state.rules.stopLow)
  ) {
    return true;
  }

  return false;
}

/** True once every skill is done, or the session-wide question cap is reached. */
export function isDiagnosticDone(state: DiagnosticState): boolean {
  if (state.history.length >= state.rules.maxTotal) {
    return true;
  }
  return state.skills.every((skill) => isSkillDone(state, skill.key));
}

/**
 * Picks the next question to ask: among skills that aren't done yet,
 * the one asked the fewest times so far (ties broken by curriculum
 * order), then its first unused bank question (bank order). Returns
 * `null` once the session is done.
 */
export function nextQuestion(state: DiagnosticState): BankQuestion | null {
  if (isDiagnosticDone(state)) {
    return null;
  }

  const candidates = state.skills.filter((skill) => !isSkillDone(state, skill.key));
  if (candidates.length === 0) {
    return null;
  }

  let chosen = candidates[0];
  let chosenAsked = state.progress[chosen.key].askedIds.length;
  for (let i = 1; i < candidates.length; i += 1) {
    const asked = state.progress[candidates[i].key].askedIds.length;
    if (asked < chosenAsked) {
      chosen = candidates[i];
      chosenAsked = asked;
    }
  }

  const askedIds = state.progress[chosen.key].askedIds;
  const question = state.bank.find(
    (candidate) => candidate.skillKey === chosen.key && !askedIds.includes(candidate.id),
  );

  return question ?? null;
}

/**
 * Records an answer and returns a new `DiagnosticState` (the input is
 * never mutated). The question id must match what `nextQuestion` would
 * return right now — the engine, not the caller, decides the order, so
 * answering the wrong id, an unknown id, a duplicate, or answering after
 * the session is done all throw.
 */
export function answerQuestion(
  state: DiagnosticState,
  questionId: string,
  isCorrect: boolean,
): DiagnosticState {
  const expected = nextQuestion(state);
  if (!expected || expected.id !== questionId) {
    throw new Error(
      `answerQuestion: expected question "${expected?.id ?? "<none, session done>"}", got "${questionId}"`,
    );
  }

  const skillKey = expected.skillKey;
  const progress = state.progress[skillKey];

  const model = new BKTModel({ p_learned: progress.pLearned });
  const pLearned = model.update(isCorrect);

  const newProgress: SkillProgress = {
    pLearned,
    askedIds: [...progress.askedIds, questionId],
    correctCount: progress.correctCount + (isCorrect ? 1 : 0),
  };

  return {
    ...state,
    progress: { ...state.progress, [skillKey]: newProgress },
    history: [...state.history, { questionId, skillKey, isCorrect }],
  };
}

/**
 * Summarises the session so far: per-skill mastery (curriculum order)
 * and a learning path (skills already confident-mastered are skipped,
 * the rest ordered by mastery ascending).
 */
export function getResults(state: DiagnosticState): DiagnosticResults {
  const skills: SkillResult[] = state.skills.map((skill) => {
    const progress = state.progress[skill.key];
    const masteryPct = Math.round(progress.pLearned * 100);

    return {
      key: skill.key,
      name: skill.name,
      masteryPct,
      status: getMasteryStatus(masteryPct),
      asked: progress.askedIds.length,
      correct: progress.correctCount,
      confident: progress.pLearned >= state.rules.stopHigh || progress.pLearned <= state.rules.stopLow,
    };
  });

  return {
    finished: isDiagnosticDone(state),
    totalAnswered: state.history.length,
    skills,
    path: buildLearningPath(skills),
  };
}
