
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
  // Snapshot penguasaan saat ini per skill, bukan histori waktu.
  label: string;
  mastery: number;
}

export interface DashboardStats {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  notStartedTopics: number;
  masteryPercentage: number;
  totalSessions: number;
  streakDays: number;
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

  // Snapshot penguasaan skill dari student_mastery.
  masteryHistory: MasteryPoint[];

  // Semua topik unik untuk visualisasi jaringan skill.
  skillNetwork: MasteryPoint[];

  recommendation: DashboardRecommendation | null;
}
