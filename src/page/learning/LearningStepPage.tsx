import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardSidebar from "../../components/layout/DashboardSidebar";

import LearningStepTopBar from "../../components/learning-step/LearningStepTopBar";
import LearningStepHero from "../../components/learning-step/LearningStepHero";
import LessonProgressCard from "../../components/learning-step/LessonProgressCard";
import LessonContentCard from "../../components/learning-step/LessonContentCard";
import LearningStepSidebar from "../../components/learning-step/LearningStepSidebar";
import LearningStepCompleteNotice from "../../components/learning-step/LearningStepCompleteNotice";

import type { LessonStep } from "../../components/learning-step/types";

import { supabase } from "../../lib/supabaseClient";

import {
  getLearningStepForPath,
  getPathSteps,
  generateOrGetLesson,
  markStepInProgress,
} from "../../lib/learning-step/materialService";

import { completeLearningStep } from "../../lib/learningpath/learningStepService";

type StepRecord = {
  id: string;
  learning_path_id: string;
  material_id: string | null;
  title: string;
  description: string | null;
  learning_objectives?: unknown;
  order_sequence: number;
  estimated_minutes: number | null;
  status: string;
};

type GeneratedSection = {
  id?: string;
  title?: string;
  heading?: string;
  content?: unknown;
  body?: unknown;
  description?: string;
  explanation?: string;
  paragraphs?: unknown;
  bullets?: unknown;
  example?: unknown;
  type?: string;
};

type GeneratedLessonData = {
  title?: string;
  description?: string;
  content?: unknown;
  sections?: GeneratedSection[];
  modules?: GeneratedSection[];
  lessons?: GeneratedSection[];
  learning_objectives?: unknown;
  objectives?: unknown;
  [key: string]: unknown;
};

type LessonSectionView = {
  id: string;
  title: string;
  content: string;
  paragraphs: string[];
  bullets: string[];
  example: string;
  description?: string;
  type?: string;
};

function toText(value: unknown): string {
  if (typeof value === "string") return value;

  if (typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(toText).filter(Boolean).join("\n\n");
  }

  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;

    if (typeof object.text === "string") return object.text;
    if (typeof object.content === "string") return object.content;
    if (typeof object.markdown === "string") return object.markdown;

    return Object.entries(object)
      .filter(([, item]) => typeof item === "string")
      .map(([key, item]) => `${key}\n${item}`)
      .join("\n\n");
  }

  return "";
}

function toStringArray(value: unknown): string[] {
  if (typeof value === "string") {
    return value.trim() ? [value] : [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") return item;
      return toText(item);
    })
    .filter((item) => item.trim().length > 0);
}

function normalizeSections(
  lesson: GeneratedLessonData,
): LessonSectionView[] {
  const rawSections =
    lesson.sections ?? lesson.modules ?? lesson.lessons;

  if (Array.isArray(rawSections) && rawSections.length > 0) {
    return rawSections.map((section, index) => {
      const paragraphs = toStringArray(section.paragraphs);
      const bullets = toStringArray(section.bullets);
      const example = toText(section.example);

      const fallbackContent = toText(
        section.content ??
          section.body ??
          section.explanation ??
          section.description,
      );

      const content = paragraphs.join("\n\n") || fallbackContent;

      return {
        id: section.id ?? `section-${index + 1}`,
        title:
          section.title ??
          section.heading ??
          `Materi ${index + 1}`,
        content,
        paragraphs:
          paragraphs.length > 0
            ? paragraphs
            : fallbackContent
                .split(/\n\s*\n/)
                .filter((item) => item.trim().length > 0),
        bullets,
        example,
        description: section.description,
        type: section.type,
      };
    });
  }

  const content = toText(lesson.content);

  if (content.trim()) {
    return [
      {
        id: "section-1",
        title: lesson.title ?? "Materi Pembelajaran",
        content,
        paragraphs: content
          .split(/\n\s*\n/)
          .filter((item) => item.trim().length > 0),
        bullets: [],
        example: "",
      },
    ];
  }

  return [];
}

function toSidebarStep(step: StepRecord): LessonStep {
  return {
    id: step.id,
    title: step.title,
    duration: `${step.estimated_minutes ?? 10} menit`,
    status: step.status,
  } as unknown as LessonStep;
}

function getSavedSection(stepId: string): number {
  try {
    const saved = Number(
      localStorage.getItem(`lesson-progress:${stepId}`) ?? "0",
    );

    return Number.isInteger(saved) && saved >= 0 ? saved : 0;
  } catch {
    return 0;
  }
}

function saveSection(stepId: string, sectionIndex: number) {
  try {
    localStorage.setItem(
      `lesson-progress:${stepId}`,
      String(sectionIndex),
    );
  } catch (error) {
    console.warn("Gagal menyimpan posisi materi:", error);
  }
}

function clearSavedSection(stepId: string) {
  try {
    localStorage.removeItem(`lesson-progress:${stepId}`);
  } catch (error) {
    console.warn("Gagal menghapus posisi materi:", error);
  }
}

export default function LearningStepPage() {
  const { id, stepId } = useParams<{
    id: string;
    stepId: string;
  }>();

  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("Siswa");

  const [steps, setSteps] = useState<StepRecord[]>([]);
  const [currentStep, setCurrentStep] =
    useState<StepRecord | null>(null);

  const [sections, setSections] = useState<LessonSectionView[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Nama pengguna untuk DashboardSidebar.
  useEffect(() => {
    let cancelled = false;

    async function loadStudentName() {
      const { data, error: authError } =
        await supabase.auth.getUser();

      if (cancelled) return;

      if (authError) {
        console.error(
          "Gagal mengambil profil pengguna:",
          authError.message,
        );
        return;
      }

      const user = data.user;

      if (!user) return;

      const metadata = user.user_metadata ?? {};

      setStudentName(
        metadata.full_name ??
          metadata.name ??
          user.email?.split("@")[0] ??
          "Siswa",
      );
    }

    void loadStudentName();

    return () => {
      cancelled = true;
    };
  }, []);

  // Memuat tahap dan materi sesuai URL.
  useEffect(() => {
    let cancelled = false;

    async function loadLearningStep() {
      if (!id || !stepId) {
        setError("ID learning path atau tahap tidak ditemukan.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setCompleted(false);
      setActiveSection(0);
      setCurrentStep(null);
      setSections([]);

      try {
        const [step, pathSteps] = await Promise.all([
          getLearningStepForPath(id, stepId),
          getPathSteps(id),
        ]);

        if (cancelled) return;

        setCurrentStep(step);
        setSteps(pathSteps as StepRecord[]);

        const result = await generateOrGetLesson(step.id);

        if (cancelled) return;

        const lesson = result.lesson as GeneratedLessonData;
        const normalized = normalizeSections(lesson);

        if (normalized.length === 0) {
          throw new Error(
            "Materi tahap ini belum memiliki konten yang dapat ditampilkan.",
          );
        }

        setSections(normalized);

        const restoredSection = Math.min(
          getSavedSection(step.id),
          normalized.length - 1,
        );

        setActiveSection(restoredSection);

        if (step.status === "completed") {
          setCompleted(true);
        } else {
          await markStepInProgress(step.id);
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Gagal memuat materi:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat materi pembelajaran.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadLearningStep();

    return () => {
      cancelled = true;
    };
  }, [id, stepId]);

  const currentStepIndex = useMemo(() => {
    if (!currentStep) return -1;

    return steps.findIndex((step) => step.id === currentStep.id);
  }, [steps, currentStep]);

  const lessonSteps = useMemo(
    () => steps.map(toSidebarStep),
    [steps],
  );

  const section = sections[activeSection];

  const completedSteps = steps.filter(
    (step) => step.status === "completed",
  ).length;

  const progress =
    steps.length > 0
      ? Math.round((completedSteps / steps.length) * 100)
      : 0;

  const nextStep = useMemo(() => {
    if (currentStepIndex < 0) return undefined;

    return steps
      .slice(currentStepIndex + 1)
      .find((step) => step.status !== "locked");
  }, [steps, currentStepIndex]);

  function selectStep(step: LessonStep) {
    if (!id || step.id === stepId) return;
    if (step.status === "locked") return;

    navigate(`/learning-path/${id}/steps/${step.id}`);
  }

  function handlePreviousSection() {
    if (!stepId || activeSection <= 0) return;

    const previousSection = activeSection - 1;

    setActiveSection(previousSection);
    saveSection(stepId, previousSection);
  }

  function handleNextSection() {
    if (!stepId || completed || completing) return;

    if (activeSection < sections.length - 1) {
      const nextSection = activeSection + 1;

      setActiveSection(nextSection);
      saveSection(stepId, nextSection);
    }
  }

  async function handleCompleteStep() {
    if (!id || !stepId || completing || completed) return;

    setCompleting(true);
    setError("");

    try {
      // Simpan status selesai ke Supabase melalui service yang tersedia.
      const result = await completeLearningStep(stepId);

      setCompleted(true);
      clearSavedSection(stepId);

      // Ambil ulang status semua tahap agar data sidebar diperbarui.
      const refreshedSteps = (await getPathSteps(id)) as StepRecord[];
      setSteps(refreshedSteps);

      if (result.unlockedStep?.id) {
        navigate(
          `/learning-path/${id}/steps/${result.unlockedStep.id}`,
          { replace: true },
        );
        return;
      }

      // Jika tidak ada tahap berikutnya, tampilkan status selesai.
      const refreshedCurrentStep = refreshedSteps.find(
        (step) => step.id === stepId,
      );

      if (refreshedCurrentStep) {
        setCurrentStep(refreshedCurrentStep);
      }
    } catch (err) {
      console.error("Gagal menyelesaikan tahap:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan penyelesaian tahap.",
      );
    } finally {
      setCompleting(false);
    }
  }

  const sidebarLayout = (content: React.ReactNode) => (
    <div className="min-h-screen bg-[#FFF9F0] text-[#29243B] lg:pl-[260px]">
      <DashboardSidebar studentName={studentName} />
      {content}
    </div>
  );

  if (loading) {
    return sidebarLayout(
      <main className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-4 w-32 animate-pulse rounded bg-[#EAE2F0]" />
        <div className="h-24 animate-pulse rounded-2xl bg-white" />
        <div className="h-36 animate-pulse rounded-2xl bg-white" />
        <div className="h-52 animate-pulse rounded-2xl bg-white" />

        <p className="text-sm text-[#766C80]">
          Memuat materi pembelajaran...
        </p>
      </main>,
    );
  }

  if (error || !currentStep || !section) {
    return sidebarLayout(
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-red-200 bg-white p-6">
          <h1 className="text-xl font-bold text-[#30213F]">
            Materi tidak dapat ditampilkan
          </h1>

          <p className="mt-3 text-sm leading-6 text-red-600">
            {error || "Tahap atau materi tidak ditemukan."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                id ? `/learning-path/${id}` : "/learning-path",
              )
            }
            className="mt-6 rounded-xl bg-[#7560B5] px-5 py-3 font-medium text-white hover:bg-[#62509B]"
          >
            Kembali ke Learning Path
          </button>
        </section>
      </main>,
    );
  }

  return sidebarLayout(
    <main className="min-w-0 px-4 pb-10 pt-5 sm:px-6 sm:pt-7 xl:px-8">
      <div className="mx-auto max-w-[1600px]">
        <LearningStepTopBar
          learningPathId={id}
          currentStep={currentStepIndex + 1}
          totalSteps={steps.length}
        />

        <LearningStepHero
          title={currentStep.title}
          duration={`${currentStep.estimated_minutes ?? 10} menit`}
        />

        <div className="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <LessonProgressCard
              activeSection={activeSection}
              totalSections={sections.length}
              completed={completed}
            />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <LessonContentCard
                section={section as never}
                activeSection={activeSection}
                totalSections={sections.length}
                completed={completed}
                onPrevious={handlePreviousSection}
                onNext={handleNextSection}
              />

              {!completed &&
                activeSection === sections.length - 1 && (
                  <button
                    type="button"
                    disabled={completing}
                    onClick={() => void handleCompleteStep()}
                    className="mt-4 flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {completing
                      ? "Menyimpan progres..."
                      : "Tandai tahap selesai"}
                  </button>
                )}

              {completed && (
                <LearningStepCompleteNotice
                  learningPathId={id}
                  nextStepId={nextStep?.id}
                  onNextStep={
                    nextStep
                      ? () =>
                          navigate(
                            `/learning-path/${id}/steps/${nextStep.id}`,
                          )
                      : undefined
                  }
                />
              )}
            </div>
          </div>

          <LearningStepSidebar
            steps={lessonSteps}
            currentStepId={currentStep.id}
            completed={completed}
            progress={progress}
            onSelectStep={selectStep}
          />
        </div>
      </div>
    </main>,
  );
}
