
import { supabase } from "../supabaseClient";

export type CheckpointQuestion = {
  id: string;
  session_question_id?: string;
  question_text: string;
  question_type?: string;
  options: Record<string, string> | Array<{ value: string; label: string }>;
  skill_key?: string | null;
  difficulty_level?: string | null;
};

export type CheckpointSession = {
  id: string;
  learning_path_id: string;
  checkpoint_number: number;
  question_count: number;
  passing_score: number;
  status: string;
  score?: number | null;
  correct_count?: number | null;
};

export type CheckpointQuiz = {
  session: CheckpointSession;
  questions: CheckpointQuestion[];
};

export type CheckpointAnswer = {
  session_question_id: string;
  answer: string;
  response_time_ms?: number;
};

export type CheckpointSubmission = {
  session_id: string;
  answers: CheckpointAnswer[];
};

async function invokeCheckpointFunction<T>(
  functionName: string,
  body: Record<string, unknown>
): Promise<T> {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  if (authError || !session?.access_token) {
    throw new Error("Sesi login berakhir. Silakan login kembali.");
  }

  const { data, error } = await supabase.functions.invoke<T>(
    functionName,
    { body }
  );

  if (error) {
    let message = error.message;

    try {
      const context = (error as { context?: Response }).context;
      if (context) {
        const payload = await context.clone().json();
        message = payload?.error ?? payload?.message ?? message;
      }
    } catch {
      // Gunakan pesan error asli jika respons bukan JSON.
    }

    throw new Error(message || `Gagal memanggil ${functionName}.`);
  }

  if (!data) {
    throw new Error(`Respons ${functionName} kosong.`);
  }

  return data;
}


export async function generateCheckpointQuiz(
  learningPathId: string,
  checkpointNumber: number
): Promise<CheckpointQuiz> {
  const result = await invokeCheckpointFunction<
    Record<string, unknown>
  >("generate-checkpoint-quiz", {
    learning_path_id: learningPathId,
    checkpoint_number: checkpointNumber,
  });

  // Mendukung respons yang membungkus session atau
  // mengembalikan session_id secara langsung.
  const rawSession = (
    result.session ?? result.quiz_session
  ) as Partial<CheckpointSession> | undefined;

  const sessionId =
    rawSession?.id ??
    (typeof result.session_id === "string"
      ? result.session_id
      : undefined);

  const questions = result.questions as
    | CheckpointQuestion[]
    | undefined;

  if (!sessionId || !Array.isArray(questions)) {
    console.error("Respons generate-checkpoint-quiz:", result);

    throw new Error(
      typeof result.error === "string"
        ? result.error
        : "Respons generator kuis tidak memiliki session_id atau daftar soal."
    );
  }

  const session: CheckpointSession = {
    id: sessionId,
    learning_path_id:
      rawSession?.learning_path_id ??
      learningPathId,
    checkpoint_number:
      rawSession?.checkpoint_number ??
      checkpointNumber,
    question_count:
      rawSession?.question_count ??
      (typeof result.question_count === "number"
        ? result.question_count
        : questions.length),
    passing_score:
      rawSession?.passing_score ??
      (typeof result.passing_score === "number"
        ? result.passing_score
        : 70),
    status: rawSession?.status ?? "in_progress",
    score: rawSession?.score ?? null,
    correct_count: rawSession?.correct_count ?? null,
  };

  const normalizedQuestions = questions.map((question) => ({
    ...question,
    session_question_id:
      question.session_question_id ?? question.id,
  }));

  if (normalizedQuestions.length !== 10) {
    throw new Error(
      `Checkpoint seharusnya berisi 10 soal, tetapi menerima ${normalizedQuestions.length}.`
    );
  }

  return {
    session,
    questions: normalizedQuestions,
  };
}

export async function submitCheckpointQuiz(
  payload: CheckpointSubmission
) {
  return invokeCheckpointFunction<Record<string, unknown>>(
    "submit-checkpoint-quiz",
    payload
  );
}
