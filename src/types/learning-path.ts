
/**
 * src/types/learning-path.ts
 *
 * Tipe data untuk fitur Learning Path SkillPath AI.
 * Disesuaikan dengan tabel:
 * - learning_goals
 * - learning_paths
 * - learning_path_steps
 */

/* =========================================
   STATUS
========================================= */

export type LearningLevel =
  | "beginner"
  | "intermediate"
  | "advanced";

export type LearningPathStatus =
  | "draft"
  | "active"
  | "completed"
  | "archived";

export type LearningStepStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "completed";

/* =========================================
   LEARNING GOAL
========================================= */

export interface LearningGoal {
  id: string;
  user_id: string;
  topic_id: number | null;
  requested_topic: string;
  description: string | null;
  target_level: LearningLevel;
  target_outcome: string | null;
  status: "pending" | "generating" | "ready" | "failed";
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

/* =========================================
   LEARNING PATH
========================================= */

export interface LearningPath {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  description: string | null;
  difficulty_level: LearningLevel;
  estimated_hours: number | null;
  generation_version: number;
  status: LearningPathStatus;
  created_at: string;
  updated_at: string;

  /**
   * Data tambahan dari query frontend.
   * Bukan kolom langsung di tabel learning_paths.
   */
  learning_path_steps?: LearningPathStep[];
  total_steps?: number;
  completed_steps?: number;
  progress_percentage?: number;
}

/* =========================================
   LEARNING PATH STEP
========================================= */

export interface LearningPathStep {
  id: string;
  learning_path_id: string;
  material_id: string | null;

  title: string;
  description: string | null;
  learning_objectives: string[];

  order_sequence: number;
  estimated_minutes: number;
  status: LearningStepStatus;

  created_at: string;
  updated_at: string;
}

/* =========================================
   DETAIL LEARNING PATH
========================================= */

export interface LearningPathDetail extends LearningPath {
  learning_path_steps: LearningPathStep[];
  total_steps: number;
  completed_steps: number;
  progress_percentage: number;
}

/* =========================================
   DETAIL SATU TAHAP
========================================= */

export interface LearningStepDetail {
  step: LearningPathStep;
  learningPath: LearningPath;
  previousStep: LearningPathStep | null;
  nextStep: LearningPathStep | null;
}

/* =========================================
   HASIL UPDATE PROGRES
========================================= */

export interface LearningProgressSummary {
  learning_path_id: string;
  total_steps: number;
  completed_steps: number;
  available_steps: number;
  in_progress_steps: number;
  locked_steps: number;
  progress_percentage: number;
}

/* =========================================
   HASIL GENERATE LEARNING PATH
========================================= */

export interface GenerateLearningPathResult {
  success: boolean;
  already_exists?: boolean;
  learning_path_id: string;
  title: string;
  status: string;
  steps_count: number;
}

/* =========================================
   HASIL GENERATE MATERI
========================================= */

export interface GenerateLearningMaterialResult {
  success: boolean;
  step_id: string;
  material_id?: string;
  title?: string;
  content?: string;
}
