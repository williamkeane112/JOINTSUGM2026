export type LessonSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  example?: string;
};

export type LessonQuizQuestion = {
  question: string;
  options: { id: "A" | "B" | "C" | "D"; text: string }[];
  correct_answer: "A" | "B" | "C" | "D";
  explanation: string;
};

export type GeneratedLesson = {
  title: string;
  summary: string;
  learning_objectives: string[];
  sections: LessonSection[];
  practice: {
    title: string;
    instructions: string[];
    expected_result: string;
  };
  quiz: LessonQuizQuestion[];
  safety_note?: string;
};

export type LearningStepRecord = {
  id: string;
  learning_path_id: string;
  material_id: string | null;
  title: string;
  description: string | null;
  learning_objectives: string[] | null;
  order_sequence: number;
  estimated_minutes: number;
  status: "locked" | "available" | "in_progress" | "completed";
};

export type LearningPathRecord = {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  goal_id: string;
};
