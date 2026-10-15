/**
 * Learning content format: Topic -> Unit -> Skill.
 * Content lives as JSON in src/content/<topic>/ so it can be reviewed in git
 * and later converted into Supabase seed data.
 */

/** Topic map: units in order, skills in order inside each unit, with prerequisites. */
export interface TopicContent {
  slug: string;
  name: string;
  /** Programming language used in code snippets, if any. */
  language: "python" | null;
  level: "pemula" | "menengah" | "lanjut";
  description: string;
  units: UnitContent[];
}

export interface UnitContent {
  key: string;
  name: string;
  skills: SkillMeta[];
}

export interface SkillMeta {
  /** Globally unique: "<topic-slug>.<skill>", matches student_mastery.skill_key. */
  key: string;
  name: string;
  /** Skill keys that must be mastered first. Must point to earlier skills. */
  prerequisites: string[];
  /** What the learner can do afterwards, phrased as observable actions. */
  objectives: string[];
  /** File name in ./skills/ once written; null while the skill is still planned. */
  file: string | null;
}

/** One skill's material and question bank (./skills/<file>.json). */
export interface SkillContent {
  skillKey: string;
  material: Material;
  questions: Question[];
}

export interface Material {
  /** One sentence: "Setelah ini kamu bisa ..." */
  goal: string;
  /** Short paragraphs; inline code in backticks. */
  explanation: string[];
  example: CodeExample;
  /** Common mistakes, each shown with code and the reason. */
  pitfalls: Pitfall[];
  /** Optional naming/syntax rules worth a single line each. */
  notes?: string[];
  /** One "predict before you run" exercise at the end of the material. */
  tryIt: CodeExample & { prompt: string };
}

export interface CodeExample {
  code: string;
  /** Exact stdout. Checked by scripts/verify-content.mjs. */
  output: string;
  note: string;
}

export interface Pitfall {
  title: string;
  code: string;
  output: string;
  why: string;
}

export type QuestionType = "predict_output" | "predict_error" | "choose_code";

export interface Question {
  /** Globally unique, e.g. "dasar-pemrograman.variabel.q01". */
  id: string;
  type: QuestionType;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  /** Code shown in the question (predict_output / predict_error). */
  code?: string;
  options: QuestionOption[];
  correctOptionId: string;
  /** Why the correct answer is correct, in 1-3 sentences. */
  explanation: string;
  /**
   * Machine check: predict_output -> stdout of `code` equals the correct option text;
   * predict_error -> running `code` raises this exception name.
   */
  verify?: { stdout: string } | { error: string };
}

export interface QuestionOption {
  id: string;
  /** Shown as code when it is program output or code. */
  text: string;
  /** Wrong options only: the misconception this answer reveals, used later by the AI Tutor. */
  misconception?: string;
  /** Wrong options only: what to tell the learner who picked it. */
  feedback?: string;
}
