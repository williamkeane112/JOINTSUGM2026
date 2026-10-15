export type TopicStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "locked";

export interface DashboardTopic {
  // ID learning goal, bukan ID tabel topics.
  id: string;
  title: string;
  description?: string;
  progress: number;
  status: TopicStatus;
  href?: string;
}

export interface MasteryPoint {
  label: string;
  mastery: number;
}

export interface DashboardStats {
  totalTopics: number;
  completedTopics: number;
  masteryPercentage: number;
  totalSessions: number;
}

export interface DashboardRecommendation {
  topicId?: string;
  topicName: string;
  description: string;
  progress: number;
  isCompleted: boolean;
}

export interface DashboardData {
  studentName: string;
  stats: DashboardStats;
  topics: DashboardTopic[];
  masteryHistory: MasteryPoint[];
  recommendation: DashboardRecommendation | null;
}
