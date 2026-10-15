
import { supabase } from "../../lib/supabaseClient";

/* =========================================================
 * TYPES
 * ======================================================= */

export interface QuizHistoryAnswer {
  question: string;
  selectedAnswer: string | null;
  correctAnswer: string | null;
  isCorrect: boolean | null;
  explanation?: string | null;
}

export interface QuizHistoryAttempt {
  id: string;
  title?: string | null;
  score: number | null;
  totalQuestions: number;
  completedAt: string;
  answers: QuizHistoryAnswer[];
}

interface QuizOption {
  id?: string | number;
  value?: string | number;
  text?: string;
  label?: string;
}

interface QuizQuestion {
  id?: string | number;
  question?: string;
  text?: string;
  skill_key?: string;
  difficulty_level?: string;
  options?: QuizOption[];
  explanation?: string;
}

interface AnswerKeyRelation {
  assessment_id?: string;
  answer_key?: unknown;
  explanations?: unknown;
}

interface AssessmentRow {
  id: string;
  user_id?: string;
  learning_goal_id?: string;
  questions: unknown;
  answers: unknown;
  score: number | null;
  total_questions: number | null;
  status: string;
  created_at: string;
  completed_at: string | null;
  diagnostic_answer_keys?:
    | AnswerKeyRelation
    | AnswerKeyRelation[]
    | null;
}

interface AnswerKeyRow {
  assessment_id: string;
  answer_key: unknown;
  explanations: unknown;
}

/* =========================================================
 * GENERAL HELPERS
 * ======================================================= */

/**
 * Supabase biasanya mengembalikan kolom JSON/JSONB sebagai object/array.
 * Namun, jika data pernah disimpan sebagai JSON string, parse juga agar
 * pemetaan jawaban tidak diam-diam menghasilkan semua nilai null.
 */
function parseJsonValue(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed || !(trimmed.startsWith("{") || trimmed.startsWith("["))) {
    return value;
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return value;
  }
}

function asRecord(
  value: unknown,
): Record<string, unknown> {
  const parsed = parseJsonValue(value);

  if (
    parsed !== null &&
    typeof parsed === "object" &&
    !Array.isArray(parsed)
  ) {
    return parsed as Record<string, unknown>;
  }

  return {};
}

function asArray<T>(value: unknown): T[] {
  const parsed = parseJsonValue(value);
  return Array.isArray(parsed) ? (parsed as T[]) : [];
}

function asString(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return null;
}

function normalize(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
}

function getAnswerKeyRelation(
  relation: AssessmentRow["diagnostic_answer_keys"],
): AnswerKeyRelation | null {
  const parsed = parseJsonValue(relation);

  if (Array.isArray(parsed)) {
    return (parsed[0] as AnswerKeyRelation | undefined) ?? null;
  }

  if (parsed !== null && typeof parsed === "object") {
    return parsed as AnswerKeyRelation;
  }

  return null;
}

/* =========================================================
 * ANSWER VALUE
 *
 * Mendukung:
 * { q1: "A", q2: "B" }
 * { "0": "A", "1": "B" }
 * [{ question_id: "q1", answer: "A" }]
 * ======================================================= */

function extractAnswerValue(
  record: Record<string, unknown>,
): unknown {
  return (
    record.answer ??
    record.selectedAnswer ??
    record.selected_answer ??
    record.value ??
    record.option_id ??
    record.optionId ??
    null
  );
}

function getValueByQuestion(
  source: unknown,
  question: QuizQuestion,
  index: number,
): unknown {
  const questionId = String(
    question.id ?? `q${index + 1}`,
  );

  const fallbackId = `q${index + 1}`;

  if (Array.isArray(source)) {
    const entries = source as unknown[];

    // Cari berdasarkan ID soal.
    const matchedEntry = entries.find((entry) => {
      const item = asRecord(entry);

      const id =
        item.question_id ??
        item.questionId ??
        item.question_id;

      return (
        id != null &&
        (
          String(id) === questionId ||
          String(id) === fallbackId
        )
      );
    });

    if (matchedEntry !== undefined) {
      if (
        matchedEntry !== null &&
        typeof matchedEntry === "object"
      ) {
        return extractAnswerValue(
          asRecord(matchedEntry),
        );
      }

      return matchedEntry;
    }

    // Fallback: array mengikuti urutan soal.
    const item = entries[index];

    if (item === undefined || item === null) {
      return null;
    }

    if (typeof item === "object") {
      return extractAnswerValue(asRecord(item));
    }

    return item;
  }

  const record = asRecord(source);

  // Prioritaskan ID asli soal.
  if (
    Object.prototype.hasOwnProperty.call(
      record,
      questionId,
    )
  ) {
    const value = record[questionId];
    return value !== null && typeof value === "object"
      ? extractAnswerValue(asRecord(value))
      : value;
  }

  // Fallback ke q1, q2, q3, dan seterusnya.
  if (
    Object.prototype.hasOwnProperty.call(
      record,
      fallbackId,
    )
  ) {
    const value = record[fallbackId];
    return value !== null && typeof value === "object"
      ? extractAnswerValue(asRecord(value))
      : value;
  }

  // Fallback ke indeks numerik berbasis nol.
  const indexKey = String(index);

  if (
    Object.prototype.hasOwnProperty.call(
      record,
      indexKey,
    )
  ) {
    const value = record[indexKey];
    return value !== null && typeof value === "object"
      ? extractAnswerValue(asRecord(value))
      : value;
  }

  return null;
}

/* =========================================================
 * OPTIONS
 * ======================================================= */

function findOption(
  value: unknown,
  question: QuizQuestion,
): QuizOption | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const rawValue = String(value).trim();
  const options = asArray<QuizOption>(
    question.options,
  );

  return options.find((option) => {
    const optionId = option.id ?? option.value;

    return (
      optionId !== undefined &&
      String(optionId).trim() === rawValue
    );
  });
}

function getOptionLabel(
  value: unknown,
  question: QuizQuestion,
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const rawValue = String(value).trim();
  const options = asArray<QuizOption>(
    question.options,
  );

  // Nilai merupakan ID atau value opsi.
  const matchedOption = findOption(
    rawValue,
    question,
  );

  if (matchedOption) {
    return (
      matchedOption.text ??
      matchedOption.label ??
      String(
        matchedOption.id ??
        matchedOption.value ??
        rawValue,
      )
    );
  }

  // Nilai merupakan teks opsi.
  const matchedText = options.find(
    (option) =>
      normalize(option.text) === normalize(rawValue) ||
      normalize(option.label) === normalize(rawValue),
  );

  if (matchedText) {
    return (
      matchedText.text ??
      matchedText.label ??
      rawValue
    );
  }

  // Misalnya nilai kunci jawaban adalah "A".
  return rawValue;
}

/* =========================================================
 * EVALUATE ANSWER
 * ======================================================= */

function evaluateAnswer(
  selectedValue: unknown,
  correctValue: unknown,
  question: QuizQuestion,
): boolean | null {
  if (
    selectedValue === null ||
    selectedValue === undefined ||
    selectedValue === "" ||
    correctValue === null ||
    correctValue === undefined ||
    correctValue === ""
  ) {
    return null;
  }

  const selectedRaw = String(selectedValue).trim();
  const correctRaw = String(correctValue).trim();

  if (!selectedRaw || !correctRaw) {
    return null;
  }

  // Jika kedua nilai merupakan ID opsi,
  // bandingkan berdasarkan ID kanonis.
  const selectedOption = findOption(
    selectedRaw,
    question,
  );

  const correctOption = findOption(
    correctRaw,
    question,
  );

  if (selectedOption && correctOption) {
    const selectedId = String(
      selectedOption.id ??
      selectedOption.value ??
      "",
    );

    const correctId = String(
      correctOption.id ??
      correctOption.value ??
      "",
    );

    return selectedId === correctId;
  }

  // Jika berupa label atau teks opsi,
  // bandingkan setelah dinormalisasi.
  const selectedLabel = getOptionLabel(
    selectedRaw,
    question,
  );

  const correctLabel = getOptionLabel(
    correctRaw,
    question,
  );

  if (
    selectedLabel === null ||
    correctLabel === null
  ) {
    return null;
  }

  return (
    normalize(selectedLabel) ===
    normalize(correctLabel)
  );
}

/* =========================================================
 * MAP ASSESSMENT
 * ======================================================= */

function mapAssessment(
  assessment: AssessmentRow,
): QuizHistoryAttempt {
  const questions = asArray<QuizQuestion>(
    assessment.questions,
  );

  const answerKeyRelation = getAnswerKeyRelation(
    assessment.diagnostic_answer_keys,
  );

  // answer_key dan explanations dapat berupa JSON object atau JSON string.
  const answerKey = answerKeyRelation?.answer_key;

  const explanations = asRecord(
    answerKeyRelation?.explanations,
  );

  const mappedAnswers: QuizHistoryAnswer[] =
    questions.map((question, index) => {
      const questionId = String(
        question.id ?? `q${index + 1}`,
      );

      const normalizedQuestion: QuizQuestion = {
        ...question,
        id: questionId,
      };

      const selectedValue = getValueByQuestion(
        assessment.answers,
        normalizedQuestion,
        index,
      );

      const correctValue = getValueByQuestion(
        answerKey,
        normalizedQuestion,
        index,
      );

      const explanationValue =
        explanations[questionId] ??
        explanations[`q${index + 1}`] ??
        question.explanation ??
        null;

      const selectedAnswer = getOptionLabel(
        selectedValue,
        normalizedQuestion,
      );

      const correctAnswer = getOptionLabel(
        correctValue,
        normalizedQuestion,
      );

      const isCorrect = evaluateAnswer(
        selectedValue,
        correctValue,
        normalizedQuestion,
      );

      return {
        question:
          question.question ??
          question.text ??
          `Pertanyaan ${index + 1}`,
        selectedAnswer,
        correctAnswer,
        isCorrect,
        explanation: asString(explanationValue),
      };
    });

  // Hitung skor dari evaluasi hanya jika semua soal
  // berhasil dievaluasi.
  const allQuestionsEvaluated =
    mappedAnswers.length > 0 &&
    mappedAnswers.every(
      (answer) => answer.isCorrect !== null,
    );

  // Jangan mencampur skor tersimpan dengan statistik yang belum lengkap.
  // Jika seluruh soal berhasil dievaluasi, skor kanonis berasal dari evaluasi.
  // Jika belum, pertahankan skor tersimpan tetapi biarkan statistik menunjukkan
  // jumlah soal yang memang belum dapat dievaluasi.
  const calculatedScore = allQuestionsEvaluated
    ? mappedAnswers.filter(
        (answer) => answer.isCorrect === true,
      ).length
    : assessment.score;

  return {
    id: assessment.id,
    title: null,
    score: calculatedScore,
    totalQuestions:
      assessment.total_questions ?? questions.length,
    completedAt:
      assessment.completed_at ?? assessment.created_at,
    answers: mappedAnswers,
  };
}

/* =========================================================
 * FETCH QUIZ HISTORY
 * ======================================================= */

export async function getQuizHistory(
  learningGoalId: string,
): Promise<QuizHistoryAttempt[]> {
  if (!learningGoalId) {
    throw new Error(
      "Learning goal ID tidak ditemukan.",
    );
  }

  // 1. Validasi sesi pengguna.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(
      `Gagal memeriksa autentikasi: ${authError.message}`,
    );
  }

  if (!user) {
    throw new Error("Pengguna belum login.");
  }

  // 2. Ambil data asesmen tanpa nested relation.
  const { data, error } = await supabase
    .from("diagnostic_assessments")
    .select(`
      id,
      user_id,
      learning_goal_id,
      questions,
      answers,
      score,
      total_questions,
      status,
      created_at,
      completed_at
    `)
    .eq("user_id", user.id)
    .eq("learning_goal_id", learningGoalId)
    .eq("status", "completed")
    .order("completed_at", {
      ascending: false,
      nullsFirst: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Gagal mengambil riwayat kuis:",
      error,
    );

    throw new Error(
      `Gagal mengambil riwayat kuis: ${error.message}`,
    );
  }

  const assessments = (
    data ?? []
  ) as unknown as AssessmentRow[];

  if (assessments.length === 0) {
    return [];
  }

  // 3. Ambil kunci jawaban untuk semua asesmen.
  const assessmentIds = assessments.map(
    (assessment) => assessment.id,
  );

  const { data: keyRows, error: keyError } =
    await supabase
      .from("diagnostic_answer_keys")
      .select(
        "assessment_id, answer_key, explanations",
      )
      .in("assessment_id", assessmentIds);

  if (keyError) {
    console.error(
      "Gagal mengambil kunci jawaban:",
      keyError,
    );

    throw new Error(
      `Gagal mengambil kunci jawaban: ${keyError.message}`,
    );
  }

  // 4. Pasangkan kunci jawaban berdasarkan ID asesmen.
  const keysByAssessment = new Map<
    string,
    AnswerKeyRelation
  >();

  for (const row of (keyRows ?? []) as AnswerKeyRow[]) {
    keysByAssessment.set(row.assessment_id, {
      assessment_id: row.assessment_id,
      answer_key: row.answer_key,
      explanations: row.explanations,
    });
  }

  // 5. Petakan setiap asesmen beserta kunci jawabannya.
  if (import.meta.env.DEV) {
    const keyIds = new Set(
      ((keyRows ?? []) as AnswerKeyRow[]).map((row) => row.assessment_id),
    );
    const missingKeyIds = assessmentIds.filter((id) => !keyIds.has(id));

    if (missingKeyIds.length > 0) {
      console.warn(
        "[QuizHistory] Kunci jawaban tidak ditemukan untuk assessment:",
        missingKeyIds,
      );
    }
  }

  const attempts = assessments.map((assessment) => {
    const answerKey = keysByAssessment.get(
      assessment.id,
    );

    return mapAssessment({
      ...assessment,
      diagnostic_answer_keys: answerKey ?? null,
    });
  });

  // 6. Debug evaluasi di browser console.
  console.table(
    attempts.map((attempt) => ({
      id: attempt.id,
      score: attempt.score,
      total: attempt.totalQuestions,
      benar: attempt.answers.filter(
        (answer) => answer.isCorrect === true,
      ).length,
      salah: attempt.answers.filter(
        (answer) => answer.isCorrect === false,
      ).length,
      belumDievaluasi: attempt.answers.filter(
        (answer) => answer.isCorrect === null,
      ).length,
    })),
  );

  return attempts;
}

/* =========================================================
 * BACKWARD COMPATIBILITY
 * ======================================================= */

export const fetchQuizHistory = getQuizHistory;
