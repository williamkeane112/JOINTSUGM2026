export interface DashTopic {
  id: string;
  name: string;
  /** Mastery percentage, 0-100 (mirrors student_progress.mastery_level). */
  masteryPct: number;
  /** True while a prerequisite topic is not yet mastered. */
  locked: boolean;
  /** ISO timestamp, or null if never practiced. */
  lastPracticedAt: string | null;
}

export interface DashboardData {
  studentName: string;
  topics: DashTopic[];
  questionsAnswered: number;
  streakDays: number;
  /** topicId -> is_correct per answer, oldest first (mirrors student_answers). */
  answerHistory: Record<string, boolean[]>;
}

export type Recommendation =
  | { kind: "continue"; topic: DashTopic }
  | { kind: "all-mastered" }
  | { kind: "empty" };
