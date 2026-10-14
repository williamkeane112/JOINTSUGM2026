import { buildMasteryCurve } from "../../lib/algorithms/bkt";
import type { DashboardData, DashTopic } from "./types";

export type DemoScenario = "budi" | "sari" | "empty" | "done";

/** One practice/diagnostic set. Every question in a set must be answered, so mock history only holds whole sets. */
export const QUESTIONS_PER_SET = 10;

type Studied = { id: string; name: string; answers: string; practicedDaysAgo: number };
type Locked = { id: string; name: string; locked: true };

const daysAgo = (days: number): string => new Date(Date.now() - days * 86_400_000).toISOString();

/**
 * Builds a scenario from raw answer strings ("T" = correct, "F" = wrong, oldest first).
 * A studied topic's mastery is the last point of its BKT curve, so the hero number and the
 * chart can never disagree. `questionsAnswered` is the sum of all recorded answers.
 */
function buildScenario(
  studentName: string,
  streakDays: number,
  parts: Array<Studied | Locked>,
): DashboardData {
  const topics: DashTopic[] = [];
  const answerHistory: Record<string, boolean[]> = {};

  for (const part of parts) {
    if ("locked" in part) {
      topics.push({ id: part.id, name: part.name, masteryPct: 0, locked: true, lastPracticedAt: null });
      continue;
    }

    const answers = [...part.answers].map((char) => char === "T");
    answerHistory[part.id] = answers;
    topics.push({
      id: part.id,
      name: part.name,
      masteryPct: buildMasteryCurve(answers).at(-1)?.masteryPct ?? 0,
      locked: false,
      lastPracticedAt: daysAgo(part.practicedDaysAgo),
    });
  }

  const questionsAnswered = Object.values(answerHistory).reduce((sum, answers) => sum + answers.length, 0);

  return { studentName, topics, questionsAnswered, streakDays, answerHistory };
}

const budi = buildScenario("Budi", 4, [
  { id: "operasi-dasar", name: "Operasi Dasar", answers: "TTTTTFTTFF", practicedDaysAgo: 2 },
  { id: "pecahan", name: "Pecahan", answers: "FFFFTFFTTF", practicedDaysAgo: 0 },
  { id: "bilangan-bulat", name: "Bilangan Bulat", answers: "FFFFTTTTFF", practicedDaysAgo: 1 },
  { id: "persamaan-linear", name: "Persamaan Linear", locked: true },
]);

const sari = buildScenario("Sari", 9, [
  { id: "operasi-dasar", name: "Operasi Dasar", answers: "TFTTTTTFFT", practicedDaysAgo: 4 },
  { id: "pecahan", name: "Pecahan", answers: "TTTTTTFFTF", practicedDaysAgo: 2 },
  { id: "bilangan-bulat", name: "Bilangan Bulat", answers: "TFTTTTFTTF", practicedDaysAgo: 1 },
  { id: "persamaan-linear", name: "Persamaan Linear", answers: "TFFFFFFTFT", practicedDaysAgo: 0 },
]);

const empty = buildScenario("Rani", 0, []);

const done = buildScenario("Dimas", 21, [
  { id: "operasi-dasar", name: "Operasi Dasar", answers: "TFTTTTTFTF", practicedDaysAgo: 13 },
  { id: "pecahan", name: "Pecahan", answers: "TTTTTTFFTF", practicedDaysAgo: 8 },
  { id: "persamaan-linear", name: "Persamaan Linear", answers: "FFFTTTTTFF", practicedDaysAgo: 1 },
]);

const scenarios: Record<DemoScenario, DashboardData> = { budi, sari, empty, done };

/** Mock data until the dashboard reads student_progress/student_answers from Supabase. Unknown or null scenario falls back to "budi". */
export function getMockDashboard(scenario: string | null): DashboardData {
  if (scenario !== null && Object.hasOwn(scenarios, scenario)) {
    return scenarios[scenario as DemoScenario];
  }
  return budi;
}
