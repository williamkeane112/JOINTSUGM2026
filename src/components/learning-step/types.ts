export interface LessonSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  example?: string;
}
export type LessonStep = {
  id: string;
  title: string;
  duration: string;
  status: "completed" | "current" | "locked";
};
