
import type {
  DashboardSourceData,
  LearningPathRow,
  StepProgressRow,
} from "./dashboardService";

import type {
  DashboardTopic,
  MasteryPoint,
} from "./types";

export interface DashboardMappedData {
  studentName: string;
  topics: DashboardTopic[];
  masteryHistory: MasteryPoint[];
  quizAttemptsCount: number;
}

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) return 0;

  return Math.max(0, Math.min(100, Math.round(value)));
}

function getStepStatus(
  progress: StepProgressRow | undefined
): DashboardTopic["status"] {
  if (!progress) return "not_started";

  if (
    progress.status === "completed" ||
    progress.progress_percent >= 100
  ) {
    return "completed";
  }

  if (
    progress.status === "in_progress" ||
    progress.progress_percent > 0
  ) {
    return "in_progress";
  }

  return "not_started";
}

export function mapDashboardData(
  source: DashboardSourceData
): DashboardMappedData {
  const topicsById = new Map(
    source.topics.map((topic) => [topic.id, topic])
  );

  // Data paths diurutkan terbaru terlebih dahulu oleh service.
  const pathByGoal = new Map<string, LearningPathRow>();

  for (const path of source.paths) {
    if (!pathByGoal.has(path.goal_id)) {
      pathByGoal.set(path.goal_id, path);
    }
  }

  // Simpan progres terbaru untuk setiap langkah.
  const progressByStep = new Map<string, StepProgressRow>();

  for (const progress of source.progressRows) {
    if (!progressByStep.has(progress.step_id)) {
      progressByStep.set(progress.step_id, progress);
    }
  }

  const stepsByPath = new Map<
    string,
    DashboardSourceData["steps"]
  >();

  for (const step of source.steps) {
    const current = stepsByPath.get(step.learning_path_id) ?? [];

    current.push(step);
    stepsByPath.set(step.learning_path_id, current);
  }

  const topics: DashboardTopic[] = source.goals.map((goal) => {
    const topic =
      goal.topic_id !== null
        ? topicsById.get(goal.topic_id)
        : undefined;

    const path = pathByGoal.get(goal.id);

    const pathSteps = path
      ? stepsByPath.get(path.id) ?? []
      : [];

    const stepProgress = pathSteps.map((step) =>
      progressByStep.get(step.id)
    );

    const progress =
      pathSteps.length > 0
        ? clampPercentage(
            stepProgress.reduce(
              (total, item) =>
                total + (item?.progress_percent ?? 0),
              0
            ) / pathSteps.length
          )
        : 0;

    const allStepsCompleted =
      pathSteps.length > 0 &&
      stepProgress.every(
        (item) => item && getStepStatus(item) === "completed"
      );

    const status: DashboardTopic["status"] =
      path?.status === "completed" || allStepsCompleted
        ? "completed"
        : progress > 0
          ? "in_progress"
          : "not_started";

    return {
      id: goal.id,
      title: topic?.name ?? goal.requested_topic,
      description:
        topic?.description ??
        "Lanjutkan perjalanan belajar sesuai tujuan yang kamu pilih.",
      progress: status === "completed" ? 100 : progress,
      status,
      href: "/topicSelect",
    };
  });

  const masteryHistory: MasteryPoint[] = source.masteryRows
    .filter((item) => item.last_assessed_at !== null)
    .map((item) => ({
      label: item.skill_key,
      mastery: clampPercentage(item.p_known * 100),
    }))
    .slice(-7);

  return {
    studentName: source.studentName,
    topics,
    masteryHistory,
    quizAttemptsCount: source.quizAttemptsCount,
  };
}
