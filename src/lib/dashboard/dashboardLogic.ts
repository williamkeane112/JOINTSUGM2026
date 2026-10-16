import type {
  DashboardData,
  DashboardTopic,
  MasteryPoint,
} from "./types";

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * masteryHistory adalah snapshot nilai per skill dari student_mastery.
 * Ini bukan data historis berdasarkan tanggal.
 */
function calculateMasteryPercentage(
  masteryHistory: MasteryPoint[],
): number {
  const validPoints = masteryHistory.filter(
    (point) =>
      Number.isFinite(point.mastery) &&
      point.mastery >= 0,
  );

  if (validPoints.length === 0) return 0;

  const total = validPoints.reduce(
    (sum, point) => sum + clampPercentage(point.mastery),
    0,
  );

  return clampPercentage(total / validPoints.length);
}

function selectRecommendation(
  topics: DashboardTopic[],
): DashboardTopic | null {
  return (
    topics.find((topic) => topic.status === "in_progress") ??
    topics.find((topic) => topic.status === "not_started") ??
    topics.find((topic) => topic.status === "completed") ??
    null
  );
}

export function buildDashboardData(
  studentName: string,
  topics: DashboardTopic[],
  masteryHistory: MasteryPoint[],
  totalSessions: number,
  streakDays = 0,
): DashboardData {
  const totalTopics = topics.length;

  const completedTopics = topics.filter(
    (topic) => topic.status === "completed",
  ).length;

  const inProgressTopics = topics.filter(
    (topic) => topic.status === "in_progress",
  ).length;

  const notStartedTopics = topics.filter(
    (topic) =>
      topic.status === "not_started" || topic.status === "locked",
  ).length;

  const recommendation = selectRecommendation(topics);

  return {
    studentName,
    topics,
    masteryHistory,
    stats: {
      totalTopics,
      completedTopics,
      inProgressTopics,
      notStartedTopics,
      masteryPercentage: calculateMasteryPercentage(masteryHistory),
      // This value is the number of quiz attempts, not learning sessions.
      totalSessions: Math.max(
        0,
        Number.isFinite(totalSessions) ? Math.floor(totalSessions) : 0,
      ),
      streakDays: Math.max(
        0,
        Number.isFinite(streakDays) ? Math.floor(streakDays) : 0,
      ),
    },
    recommendation: recommendation
      ? {
          topicId: recommendation.id,
          topicName: recommendation.title,
          description:
            recommendation.description ??
            "Lanjutkan perjalanan belajar sesuai tujuan yang kamu pilih.",
          progress: clampPercentage(recommendation.progress),
          isCompleted: recommendation.status === "completed",
        }
      : null,
  };
}
