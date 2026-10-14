/**
 * Bayesian Knowledge Tracing (BKT) model — client-side, no side effects outside the instance.
 *
 * Tracks the probability that a student has mastered a skill/topic from their answers.
 * Spec: .kiro/steering/03-bkt-algorithm.md
 */

export interface BKTParameters {
  p_learned: number; // P(L) - current mastery probability (0-1)
  p_transit: number; // P(T) - learning rate (~0.1)
  p_guess: number; // P(G) - guessing probability (~0.25)
  p_slip: number; // P(S) - slip/mistake probability (~0.1)
}

export class BKTModel {
  private p_learned: number;
  private readonly p_transit: number;
  private readonly p_guess: number;
  private readonly p_slip: number;

  constructor(params: Partial<BKTParameters> = {}) {
    this.p_learned = params.p_learned ?? 0.0;
    this.p_transit = params.p_transit ?? 0.1;
    this.p_guess = params.p_guess ?? 0.25;
    this.p_slip = params.p_slip ?? 0.1;
  }

  /**
   * Update P(L) from one answer.
   *
   * Correct: P(L|correct) = P(L)(1 - P(S)) / [P(L)(1 - P(S)) + (1 - P(L))P(G)]
   * Wrong:   P(L|wrong)   = P(L)P(S) / [P(L)P(S) + (1 - P(L))(1 - P(G))]
   * Then learning: P(L_new) = P(L|answer) + (1 - P(L|answer))P(T)
   */
  update(isCorrect: boolean): number {
    let numerator: number;
    let denominator: number;

    if (isCorrect) {
      numerator = this.p_learned * (1 - this.p_slip);
      denominator = numerator + (1 - this.p_learned) * this.p_guess;
    } else {
      numerator = this.p_learned * this.p_slip;
      denominator = numerator + (1 - this.p_learned) * (1 - this.p_guess);
    }

    // A zero denominator means the evidence is impossible under the model; treat as "not learned".
    const pLearnedGivenAnswer = denominator > 0 ? numerator / denominator : 0;

    const next = pLearnedGivenAnswer + (1 - pLearnedGivenAnswer) * this.p_transit;
    this.p_learned = Number.isFinite(next) ? Math.max(0, Math.min(1, next)) : 0;

    return this.p_learned;
  }

  /** Current mastery as a percentage (0-100). */
  getMasteryPercentage(): number {
    return this.p_learned * 100;
  }

  isMastered(threshold: number = 0.95): boolean {
    return this.p_learned >= threshold;
  }

  getParameters(): BKTParameters {
    return {
      p_learned: this.p_learned,
      p_transit: this.p_transit,
      p_guess: this.p_guess,
      p_slip: this.p_slip,
    };
  }

  getStatus(): "not_mastered" | "in_progress" | "mastered" {
    if (this.p_learned < 0.4) return "not_mastered";
    if (this.p_learned < 0.7) return "in_progress";
    return "mastered";
  }
}

export interface CurvePoint {
  /** 0 is the starting point; i is the state after the i-th answer. */
  answer: number;
  masteryPct: number;
  /** Correctness of the answer that produced this point; null for the starting point. */
  correct: boolean | null;
}

/** Demo starting mastery. Real values come from student_progress.p_learned. */
export const CURVE_INITIAL_P_LEARNED = 0.1;

/** Replays answers (oldest first) through BKT and returns answers.length + 1 points. */
export function buildMasteryCurve(
  answers: boolean[],
  initialPLearned: number = CURVE_INITIAL_P_LEARNED,
): CurvePoint[] {
  const model = new BKTModel({ p_learned: initialPLearned });
  const points: CurvePoint[] = [
    { answer: 0, masteryPct: model.getMasteryPercentage(), correct: null },
  ];

  answers.forEach((isCorrect, index) => {
    model.update(isCorrect);
    points.push({ answer: index + 1, masteryPct: model.getMasteryPercentage(), correct: isCorrect });
  });

  return points;
}
