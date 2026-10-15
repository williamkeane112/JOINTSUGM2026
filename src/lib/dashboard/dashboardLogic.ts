import type {
  DashboardData,
  DashboardTopic,
  MasteryPoint,
} from "./types";

export function buildDashboardData(
  studentName: string,
  topics: DashboardTopic[],
  masteryHistory: MasteryPoint[],
  totalSessions: number
): DashboardData {
  const totalTopics = topics.length;

  const completedTopics = topics.filter(
    (topic) => topic.status === "completed"
  ).length;

  const masteryPercentage =
    masteryHistory.length > 0
      ? Math.round(
          masteryHistory.reduce(
            (total, point) => total + point.mastery,
            0
          ) / masteryHistory.length
        )
      : 0;

  const recommendation =
    topics.find((topic) => topic.status === "in_progress") ??
    topics.find((topic) => topic.status === "not_started") ??
    topics.find((topic) => topic.status === "completed") ??
    null;

  return {
    studentName,
    topics,
    masteryHistory,
    stats: {
      totalTopics,
      completedTopics,
      masteryPercentage,
      totalSessions,
    },
    recommendation: recommendation
      ? {
          topicId: recommendation.id,
          topicName: recommendation.title,
          description:
            recommendation.description ??
            "Lanjutkan perjalanan belajar sesuai tujuan yang kamu pilih.",
          progress: recommendation.progress,
          isCompleted: recommendation.status === "completed",
        }
      : null,
  };
}
