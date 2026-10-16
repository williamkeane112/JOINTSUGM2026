
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
  skillNetwork: MasteryPoint[];
  quizAttemptsCount: number;
  streakDays: number;
}

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\s+/g, " ");
}

function getEffectiveProgress(
  step: DashboardSourceData["steps"][number],
  progress: StepProgressRow | undefined,
): number {
  if (step.status === "completed") return 100;

  if (progress) {
    if (
      progress.status === "completed" ||
      progress.progress_percent >= 100
    ) {
      return 100;
    }

    return clampPercentage(progress.progress_percent);
  }

  return 0;
}

function getEffectiveStatus(
  step: DashboardSourceData["steps"][number],
  progress: StepProgressRow | undefined,
): DashboardTopic["status"] {
  if (
    step.status === "completed" ||
    progress?.status === "completed" ||
    (progress?.progress_percent ?? 0) >= 100
  ) {
    return "completed";
  }

  if (
    step.status === "in_progress" ||
    progress?.status === "in_progress" ||
    (progress?.progress_percent ?? 0) > 0
  ) {
    return "in_progress";
  }

  if (step.status === "locked") return "locked";

  return "not_started";
}

export function mapDashboardData(
  source: DashboardSourceData,
): DashboardMappedData {
  // Indeks topik berdasarkan ID.
  const topicsById = new Map(
    source.topics.map((topic) => [topic.id, topic]),
  );

  // Path sudah diurutkan dari terbaru ke terlama oleh service.
  const pathByGoal = new Map<string, LearningPathRow>();

  for (const path of source.paths) {
    if (!pathByGoal.has(path.goal_id)) {
      pathByGoal.set(path.goal_id, path);
    }
  }

  // Ambil progres terbaru untuk setiap tahap.
  const progressByStep = new Map<string, StepProgressRow>();

  for (const progress of source.progressRows) {
    const existing = progressByStep.get(progress.step_id);

    if (
      !existing ||
      new Date(progress.updated_at).getTime() >
        new Date(existing.updated_at).getTime()
    ) {
      progressByStep.set(progress.step_id, progress);
    }
  }

  // Kelompokkan tahap berdasarkan learning path.
  const stepsByPath = new Map<
    string,
    DashboardSourceData["steps"]
  >();

  for (const step of source.steps) {
    const pathSteps = stepsByPath.get(step.learning_path_id) ?? [];

    pathSteps.push(step);
    stepsByPath.set(step.learning_path_id, pathSteps);
  }

  // Hitung progres dan status setiap learning path.
  const progressByPath = new Map<
    string,
    {
      progress: number;
      status: DashboardTopic["status"];
    }
  >();

  for (const path of source.paths) {
    const pathSteps = [
      ...(stepsByPath.get(path.id) ?? []),
    ].sort((a, b) => a.order_sequence - b.order_sequence);

    const effectiveProgress = pathSteps.map((step) =>
      getEffectiveProgress(step, progressByStep.get(step.id)),
    );

    const effectiveStatuses = pathSteps.map((step) =>
      getEffectiveStatus(step, progressByStep.get(step.id)),
    );

    const progress =
      pathSteps.length > 0
        ? clampPercentage(
            effectiveProgress.reduce(
              (sum, value) => sum + value,
              0,
            ) / pathSteps.length,
          )
        : 0;

    const allStepsCompleted =
      pathSteps.length > 0 &&
      effectiveStatuses.every(
        (status) => status === "completed",
      );

    const hasProgress = effectiveStatuses.some(
      (status) =>
        status === "in_progress" || status === "completed",
    );

    const status: DashboardTopic["status"] =
      path.status === "completed" || allStepsCompleted
        ? "completed"
        : hasProgress
          ? "in_progress"
          : "not_started";

    progressByPath.set(path.id, {
      progress: status === "completed" ? 100 : progress,
      status,
    });
  }

  // Buat satu kartu untuk setiap goal pengguna.
  const mappedTopics: DashboardTopic[] = source.goals.map(
    (goal) => {
      const topic =
        goal.topic_id !== null
          ? topicsById.get(goal.topic_id)
          : undefined;

      const path = pathByGoal.get(goal.id);
      const pathProgress = path
        ? progressByPath.get(path.id)
        : undefined;

      return {
        id: goal.id,
        title: topic?.name ?? goal.requested_topic,
        description:
          topic?.description ??
          "Lanjutkan perjalanan belajar sesuai tujuan yang kamu pilih.",
        progress: pathProgress?.progress ?? 0,
        status: pathProgress?.status ?? "not_started",
        href: path
          ? `/learning-path/${path.id}`
          : "/topicSelect",
      };
    },
  );

  // Snapshot penguasaan yang sudah dinilai melalui kuis.
  const masteryHistory: MasteryPoint[] = source.masteryRows
    .filter(
      (item) =>
        item.last_assessed_at !== null &&
        Number.isFinite(item.p_known),
    )
    .map((item) => ({
      label: item.skill_key,
      mastery: clampPercentage(item.p_known * 100),
    }));

  // Satu goal terbaru untuk setiap topic_id.
  const goalByTopic = new Map<
    number,
    (typeof source.goals)[number]
  >();

  for (const goal of source.goals) {
    if (
      goal.topic_id === null ||
      goalByTopic.has(goal.topic_id)
    ) {
      continue;
    }

    goalByTopic.set(goal.topic_id, goal);
  }

  // Bangun jaringan skill tanpa mengubah masteryHistory.
  const skillNetwork: MasteryPoint[] = [];
  const networkIndexByName = new Map<string, number>();

  // Masukkan skill yang sudah dinilai.
  for (const item of masteryHistory) {
    const key = normalizeName(item.label);

    if (!key) continue;

    const existingIndex = networkIndexByName.get(key);

    if (existingIndex !== undefined) {
      // Jika ada duplikat nama skill, gunakan nilai terakhir.
      skillNetwork[existingIndex].mastery = item.mastery;
      continue;
    }

    networkIndexByName.set(key, skillNetwork.length);
    skillNetwork.push({ ...item });
  }

  // Tambahkan semua topik yang dipilih pengguna.
  // Topik yang belum dinilai menggunakan progres path atau 0%.
  for (const [topicId, goal] of goalByTopic) {
    const topic = topicsById.get(topicId);

    if (!topic) continue;

    const key = normalizeName(topic.name);

    if (!key) continue;

    const path = pathByGoal.get(goal.id);
    const pathProgress = path
      ? progressByPath.get(path.id)
      : undefined;

    const existingIndex = networkIndexByName.get(key);

    if (existingIndex !== undefined) {
      // Nilai dari penilaian tetap diprioritaskan.
      // Jika skill belum pernah dinilai, gunakan progres path.
      const hasAssessment = masteryHistory.some(
        (item) => normalizeName(item.label) === key,
      );

      if (!hasAssessment && pathProgress) {
        skillNetwork[existingIndex].mastery =
          pathProgress.progress;
      }

      continue;
    }

    networkIndexByName.set(key, skillNetwork.length);

    skillNetwork.push({
      label: topic.name,
      mastery: pathProgress?.progress ?? 0,
    });
  }

  // Goal tanpa topic_id tetap masuk ke jaringan.
  for (const goal of source.goals) {
    if (goal.topic_id !== null) continue;

    const label = goal.requested_topic.trim();
    const key = normalizeName(label);

    if (!key || networkIndexByName.has(key)) continue;

    const path = pathByGoal.get(goal.id);
    const pathProgress = path
      ? progressByPath.get(path.id)
      : undefined;

    networkIndexByName.set(key, skillNetwork.length);

    skillNetwork.push({
      label,
      mastery: pathProgress?.progress ?? 0,
    });
  }

  return {
    studentName: source.studentName,
    topics: mappedTopics,
    masteryHistory,
    skillNetwork,
    quizAttemptsCount: source.quizAttemptsCount,
    streakDays: source.streakDays,
  };
}
