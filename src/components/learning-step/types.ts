export type LessonSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LessonStep = {
  id: string;
  title: string;
  duration: string;
  status: "completed" | "current" | "locked";
};
