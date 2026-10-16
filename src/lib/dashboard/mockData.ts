import type {
  DashboardData,
  DashboardTopic,
} from "./types";

const demoTopics: DashboardTopic[] = [
  {
    id: "topic-1",
    title: "Dasar Pemrograman",
    description:
      "Pelajari variabel, tipe data, operator, dan dasar logika pemrograman.",
    progress: 85,
    status: "in_progress",
    href: "/topicSelect",
  },
  {
    id: "topic-2",
    title: "Struktur Data",
    description:
      "Kenali array, linked list, stack, queue, dan penggunaannya.",
    progress: 45,
    status: "in_progress",
    href: "/topicSelect",
  },
  {
    id: "topic-3",
    title: "Algoritma",
    description:
      "Pahami langkah sistematis untuk menyelesaikan permasalahan.",
    progress: 100,
    status: "completed",
    href: "/topicSelect",
  },
  {
    id: "topic-4",
    title: "Basis Data",
    description:
      "Pelajari tabel, relasi, query SQL, dan perancangan basis data.",
    progress: 0,
    status: "not_started",
    href: "/topicSelect",
  },
  {
    id: "topic-5",
    title: "Pemrograman Web",
    description:
      "Pelajari cara membangun aplikasi web dengan HTML, CSS, dan JavaScript.",
    progress: 0,
    status: "not_started",
    href: "/topicSelect",
  },
  {
    id: "topic-6",
    title: "Kecerdasan Buatan",
    description:
      "Kenali konsep AI dan penerapannya dalam menyelesaikan masalah.",
    progress: 0,
    status: "locked",
    href: "/topicSelect",
  },
];

export const mockDashboardData: DashboardData = {
  studentName: "Siswa",

  stats: {
    totalTopics: 5,
    completedTopics: 1,
    inProgressTopics: 2,
    notStartedTopics: 2,
    masteryPercentage: 68,
    totalSessions: 12,
    streakDays: 0,
  },

  topics: demoTopics,

  masteryHistory: [
    { label: "Sen", mastery: 35 },
    { label: "Sel", mastery: 42 },
    { label: "Rab", mastery: 48 },
    { label: "Kam", mastery: 45 },
    { label: "Jum", mastery: 57 },
    { label: "Sab", mastery: 63 },
    { label: "Min", mastery: 68 },
  ],

  recommendation: {
    topicId: "topic-1",
    topicName: "Dasar Pemrograman",
    description:
      "Lanjutkan materi Dasar Pemrograman untuk meningkatkan pemahamanmu.",
    progress: 85,
    isCompleted: false,
  },
};

export function getMockDashboard(
  demo?: string | null
): DashboardData {
  if (demo === "empty") {
    return {
      studentName: "Siswa",
      stats: {
        totalTopics: 0,
        completedTopics: 0,
        inProgressTopics: 0,
        notStartedTopics: 0,
        masteryPercentage: 0,
        totalSessions: 0,
        streakDays: 0,
      },
      topics: [],
      masteryHistory: [],
      recommendation: null,
    };
  }

  return mockDashboardData;
}
