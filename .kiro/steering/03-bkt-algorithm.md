# BKT Algorithm Implementation (Client-Side TypeScript)

> **Location**: `/src/lib/algorithms/bkt.ts`  
> **Language**: TypeScript (runs in browser, not separate backend)

---

## Overview

Bayesian Knowledge Tracing (BKT) adalah algoritma untuk track probabilitas bahwa siswa sudah "menguasai" suatu skill/topik berdasarkan history jawaban mereka.

**4 Parameter Utama**:
- **P(L)** — Probability Learned (0-1) — current mastery
- **P(T)** — Probability of Transition (learning rate, ~0.1)
- **P(G)** — Probability of Guess (~0.25)
- **P(S)** — Probability of Slip (mistake, ~0.1)

---

## TypeScript Implementation

### Interface

```typescript
export interface BKTParameters {
  p_learned: number;  // P(L) - Current mastery probability (0-1)
  p_transit: number;  // P(T) - Learning rate (~0.1)
  p_guess: number;    // P(G) - Guessing probability (~0.25)
  p_slip: number;     // P(S) - Slip/mistake probability (~0.1)
}
```

### Class

```typescript
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
   * Update P(L) based on student answer
   *
   * Formula for correct answer:
   * P(L|correct) = P(L) * (1 - P(S)) / [P(L) * (1 - P(S)) + (1 - P(L)) * P(G)]
   *
   * Formula for wrong answer:
   * P(L|wrong) = P(L) * P(S) / [P(L) * P(S) + (1 - P(L)) * (1 - P(G))]
   *
   * Then apply learning:
   * P(L_new) = P(L|answer) + (1 - P(L|answer)) * P(T)
   */
  update(isCorrect: boolean): number {
    let numerator: number;
    let denominator: number;

    if (isCorrect) {
      // P(L | correct answer)
      numerator = this.p_learned * (1 - this.p_slip);
      denominator = numerator + (1 - this.p_learned) * this.p_guess;
    } else {
      // P(L | wrong answer)
      numerator = this.p_learned * this.p_slip;
      denominator = numerator + (1 - this.p_learned) * (1 - this.p_guess);
    }

    // Update P(L) with evidence
    const p_learned_given_answer =
      denominator > 0 ? numerator / denominator : 0;

    // Apply learning transition
    this.p_learned =
      p_learned_given_answer + (1 - p_learned_given_answer) * this.p_transit;

    // Clamp between 0 and 1
    this.p_learned = Math.max(0, Math.min(1, this.p_learned));

    return this.p_learned;
  }

  /**
   * Get current mastery as percentage (0-100)
   */
  getMasteryPercentage(): number {
    return this.p_learned * 100;
  }

  /**
   * Check if topic is considered mastered
   */
  isMastered(threshold: number = 0.95): boolean {
    return this.p_learned >= threshold;
  }

  /**
   * Get current BKT parameters
   */
  getParameters(): BKTParameters {
    return {
      p_learned: this.p_learned,
      p_transit: this.p_transit,
      p_guess: this.p_guess,
      p_slip: this.p_slip,
    };
  }

  /**
   * Get mastery status based on thresholds
   */
  getStatus(): "not_mastered" | "in_progress" | "mastered" {
    if (this.p_learned < 0.4) return "not_mastered";
    if (this.p_learned < 0.7) return "in_progress";
    return "mastered";
  }
}
```

---

## Usage Example

```typescript
import { BKTModel } from '@/lib/algorithms/bkt';

// Initialize with previous state from database
const bkt = new BKTModel({
  p_learned: 0.45,  // from student_progress.p_learned
  p_transit: 0.1,
  p_guess: 0.25,
  p_slip: 0.1
});

// Student answers question correctly
const newMastery = bkt.update(true);
console.log(newMastery);  // e.g., 0.523 (52.3%)

// Get percentage for display
const percentage = bkt.getMasteryPercentage();  // 52.3

// Check status
const status = bkt.getStatus();  // "in_progress"

// Save back to database
await supabase
  .from('student_progress')
  .update({
    p_learned: bkt.getParameters().p_learned,
    mastery_level: percentage
  })
  .eq('user_id', userId)
  .eq('topic_id', topicId);
```

---

## Mastery Thresholds

```typescript
const THRESHOLDS = {
  NOT_MASTERED: 0.40,  // < 40% → 🔴 Red
  IN_PROGRESS: 0.70,   // 40-70% → 🟡 Amber
  MASTERED: 0.95,      // > 70% → 🟢 Green
                       // (tapi UI pake 70%, internal validation 95%)
};
```

---

## Important Notes

1. **Client-side only** — no Python backend needed
2. **Pure function** — no side effects, easy to test
3. **Immutable** — return new state, don't mutate
4. **Validation** — always clamp P(L) between 0 and 1
5. **Database sync** — save updated P(L) after every answer

---

*Ref: Full BKT theory di `docs/PROJECT_PLAN.md` section "BKT Algorithm"*
