/**
 * Static mock data for the dashboard page.
 *
 * This iteration intentionally does NOT fetch from Supabase/BKT —
 * see `.kiro/steering/session-progress.md` for the deferred wiring plan.
 */

export type TopicStatus = "mastered" | "progress" | "weak" | "locked";

export interface DashboardData {
  studentName: string;
  streakDays: number;
  totalXp: number;
  level: number;
  overallMastery: number; // 0-100
  topicsMastered: number;
  totalTopics: number;
  recommendedTopic: {
    name: string;
    mastery: number; // 0-100
    estimatedMinutes: number;
    status: "weak" | "progress";
  } | null;
  recentActivity: { topic: string; timeAgo: string; xpGained: number }[];
  knowledgeMapPreview: {
    name: string;
    status: TopicStatus;
    mastery: number;
  }[];
  achievements: { title: string; description: string; unlocked: boolean }[];
}

export const mockDashboardData: DashboardData = {
  studentName: "Budi Santoso",
  streakDays: 3,
  totalXp: 1240,
  level: 7,
  overallMastery: 68,
  topicsMastered: 2,
  totalTopics: 5,
  recommendedTopic: {
    name: "Pecahan",
    mastery: 45,
    estimatedMinutes: 20,
    status: "progress",
  },
  recentActivity: [
    { topic: "Operasi Dasar", timeAgo: "2 jam lalu", xpGained: 15 },
    { topic: "Pecahan", timeAgo: "Kemarin", xpGained: 10 },
    { topic: "Bilangan Bulat", timeAgo: "2 hari lalu", xpGained: 20 },
  ],
  knowledgeMapPreview: [
    { name: "Operasi Dasar", status: "mastered", mastery: 92 },
    { name: "Pecahan", status: "progress", mastery: 45 },
    { name: "Bilangan Bulat", status: "mastered", mastery: 78 },
    { name: "Persamaan Linear", status: "weak", mastery: 30 },
    { name: "Statistika", status: "locked", mastery: 0 },
  ],
  achievements: [
    {
      title: "Langkah Pertama",
      description: "Selesaikan tes diagnostik pertamamu",
      unlocked: true,
    },
    {
      title: "Tiga Hari Beruntun",
      description: "Belajar 3 hari berturut-turut",
      unlocked: true,
    },
    {
      title: "Jagoan Pecahan",
      description: "Kuasai topik Pecahan hingga 100%",
      unlocked: false,
    },
    {
      title: "Seminggu Penuh",
      description: "Belajar 7 hari berturut-turut",
      unlocked: false,
    },
  ],
};

export const emptyDashboardData: DashboardData = {
  studentName: "Siswa Baru",
  streakDays: 0,
  totalXp: 0,
  level: 1,
  overallMastery: 0,
  topicsMastered: 0,
  totalTopics: 5,
  recommendedTopic: null,
  recentActivity: [],
  knowledgeMapPreview: [
    { name: "Operasi Dasar", status: "locked", mastery: 0 },
    { name: "Pecahan", status: "locked", mastery: 0 },
    { name: "Bilangan Bulat", status: "locked", mastery: 0 },
    { name: "Persamaan Linear", status: "locked", mastery: 0 },
    { name: "Statistika", status: "locked", mastery: 0 },
  ],
  achievements: [
    {
      title: "Langkah Pertama",
      description: "Selesaikan tes diagnostik pertamamu",
      unlocked: false,
    },
    {
      title: "Tiga Hari Beruntun",
      description: "Belajar 3 hari berturut-turut",
      unlocked: false,
    },
    {
      title: "Jagoan Pecahan",
      description: "Kuasai topik Pecahan hingga 100%",
      unlocked: false,
    },
    {
      title: "Seminggu Penuh",
      description: "Belajar 7 hari berturut-turut",
      unlocked: false,
    },
  ],
};
