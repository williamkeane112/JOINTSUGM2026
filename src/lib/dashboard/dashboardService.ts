
import { supabase } from "../supabaseClient";

export interface DashboardProfileRow {
  id: string;
  full_name: string | null;
}

export interface LearningGoalRow {
  id: string;
  topic_id: number | null;
  requested_topic: string;
  status: string;
  created_at: string;
}

export interface LearningPathRow {
  id: string;
  goal_id: string;
  title: string;
  status: string;
  created_at: string;
}

export interface LearningStepRow {
  id: string;
  learning_path_id: string;
  title: string;
  status: string;
  order_sequence: number;
}

export interface StepProgressRow {
  step_id: string;
  status: string;
  progress_percent: number;
  updated_at: string;
}

export interface DashboardTopicRow {
  id: number;
  name: string;
  description: string | null;
}

export interface MasteryRow {
  skill_key: string;
  p_known: number;
  last_assessed_at: string | null;
}

export interface DashboardSourceData {
  userId: string;
  studentName: string;
  goals: LearningGoalRow[];
  topics: DashboardTopicRow[];
  paths: LearningPathRow[];
  steps: LearningStepRow[];
  progressRows: StepProgressRow[];
  masteryRows: MasteryRow[];
  quizAttemptsCount: number;
}

function throwIfError(
  error: { message: string } | null
): void {
  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchDashboardData(): Promise<DashboardSourceData> {
  // 1. Ambil pengguna yang sedang login.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  throwIfError(authError);

  if (!user) {
    throw new Error(
      "Sesi login tidak ditemukan. Silakan login kembali."
    );
  }

  // 2. Ambil profil dan tujuan belajar secara bersamaan.
  const [profileResult, goalsResult] = await Promise.all([
    supabase
      .from("users")
      .select("id, full_name")
      .eq("id", user.id)
      .maybeSingle(),

    supabase
      .from("learning_goals")
      .select(
        "id, topic_id, requested_topic, status, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  throwIfError(profileResult.error);
  throwIfError(goalsResult.error);

  const goals: LearningGoalRow[] =
    (goalsResult.data ?? []) as LearningGoalRow[];

  const studentName =
    profileResult.data?.full_name?.trim() ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Siswa";

  // 3. Ambil topik dan learning path.
  const goalIds = goals.map((goal) => goal.id);

  const topicIds = [
    ...new Set(
      goals
        .map((goal) => goal.topic_id)
        .filter((id): id is number => id !== null)
    ),
  ];

  const [topicsResult, pathsResult] = await Promise.all([
    topicIds.length > 0
      ? supabase
          .from("topics")
          .select("id, name, description")
          .in("id", topicIds)
      : Promise.resolve({ data: [], error: null }),

    goalIds.length > 0
      ? supabase
          .from("learning_paths")
          .select("id, goal_id, title, status, created_at")
          .eq("user_id", user.id)
          .in("goal_id", goalIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);

  throwIfError(topicsResult.error);
  throwIfError(pathsResult.error);

  const topics: DashboardTopicRow[] =
    (topicsResult.data ?? []) as DashboardTopicRow[];

  const paths: LearningPathRow[] =
    (pathsResult.data ?? []) as LearningPathRow[];

  // 4. Ambil langkah dari seluruh learning path pengguna.
  const pathIds = [...new Set(paths.map((path) => path.id))];

  const stepsResult =
    pathIds.length > 0
      ? await supabase
          .from("learning_path_steps")
          .select(
            "id, learning_path_id, title, status, order_sequence"
          )
          .in("learning_path_id", pathIds)
          .order("order_sequence", { ascending: true })
      : { data: [], error: null };

  throwIfError(stepsResult.error);

  const steps: LearningStepRow[] =
    (stepsResult.data ?? []) as LearningStepRow[];

  // 5. Ambil progres, penguasaan skill, dan jumlah percobaan kuis.
  const stepIds = [...new Set(steps.map((step) => step.id))];

  const [progressResult, masteryResult, quizResult] =
    await Promise.all([
      stepIds.length > 0
        ? supabase
            .from("step_progress")
            .select(
              "step_id, status, progress_percent, updated_at"
            )
            .eq("user_id", user.id)
            .in("step_id", stepIds)
            .order("updated_at", { ascending: false })
        : Promise.resolve({ data: [], error: null }),

      supabase
        .from("student_mastery")
        .select("skill_key, p_known, last_assessed_at")
        .eq("user_id", user.id)
        .order("last_assessed_at", { ascending: true }),

      supabase
        .from("quiz_attempts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

  throwIfError(progressResult.error);
  throwIfError(masteryResult.error);
  throwIfError(quizResult.error);

  return {
    userId: user.id,
    studentName,
    goals,
    topics,
    paths,
    steps,
    progressRows:
      (progressResult.data ?? []) as StepProgressRow[],
    masteryRows:
      (masteryResult.data ?? []) as MasteryRow[],
    quizAttemptsCount: quizResult.count ?? 0,
  };
}
