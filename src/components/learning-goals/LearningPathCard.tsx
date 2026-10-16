
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  LoaderCircle,
  Sparkles,
  Target,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

interface LearningPathStep {
  id: string;
  learning_path_id: string;
  material_id?: string | null;
  title: string;
  description?: string | null;
  content?: string | null;
  order_sequence?: number | null;
  estimated_minutes?: number | null;
  status?: string | null;
}

interface LearningPathCardProps {
  learningPath: Record<string, any> | null;
  pathGenerated: boolean;
  hasAssessment: boolean;
  generating?: boolean;
  onGenerate: () => void;
  onContinue?: () => void;
  onTakeAssessment?: () => void;
}

interface PathContent {
  title: string;
  description: string;
  modules: LearningPathStep[];
}

function readPathContent(
  learningPath: Record<string, any> | null,
): PathContent {
  if (!learningPath) {
    return {
      title: "Learning Path Personal",
      description:
        "Selesaikan tes diagnostik agar AI dapat membuat jalur belajar yang sesuai dengan kemampuanmu.",
      modules: [],
    };
  }

  const possibleModules =
    learningPath.modules ??
    learningPath.steps ??
    learningPath.learning_path?.modules ??
    learningPath.learning_path?.steps ??
    learningPath.path?.modules ??
    learningPath.path?.steps ??
    learningPath.content?.modules ??
    learningPath.content?.steps ??
    learningPath.learning_path_steps ??
    [];

  return {
    title:
      learningPath.title ??
      learningPath.name ??
      learningPath.learning_path?.title ??
      "Learning Path Personal",
    description:
      learningPath.description ??
      learningPath.learning_path?.description ??
      "Jalur belajar yang disesuaikan dengan tujuan dan kemampuanmu.",
    modules: Array.isArray(possibleModules) ? possibleModules : [],
  };
}

export default function LearningPathCard({
  learningPath,
  pathGenerated,
  hasAssessment,
  generating = false,
  onGenerate,
  onContinue,
  onTakeAssessment,
}: LearningPathCardProps) {
  const path = readPathContent(learningPath);

  const [steps, setSteps] = useState<LearningPathStep[]>(
    path.modules as LearningPathStep[],
  );
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [stepsError, setStepsError] = useState("");

  const learningPathId = learningPath?.id as string | undefined;

  useEffect(() => {
    let cancelled = false;

    async function loadLearningPathSteps() {
      if (!pathGenerated || !learningPathId) {
        setSteps([]);
        setStepsError("");
        setLoadingSteps(false);
        return;
      }

      setLoadingSteps(true);
      setStepsError("");

      try {
        const { data, error } = await supabase
          .from("learning_path_steps")
          .select(
            `
              id,
              learning_path_id,
              material_id,
              title,
              description,
              order_sequence,
              estimated_minutes,
              status
            `,
          )
          .eq("learning_path_id", learningPathId)
          .order("order_sequence", { ascending: true });

        if (error) {
          throw error;
        }

        if (!cancelled) {
          setSteps((data ?? []) as LearningPathStep[]);
        }
      } catch (error) {
        console.error(
          "Gagal mengambil tahapan learning path:",
          error,
        );

        if (!cancelled) {
          setStepsError(
            error instanceof Error
              ? error.message
              : "Gagal mengambil tahapan belajar.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSteps(false);
        }
      }
    }

    void loadLearningPathSteps();

    return () => {
      cancelled = true;
    };
  }, [learningPathId, pathGenerated]);

  const handlePrimaryAction = () => {
    if (generating) return;

    if (!hasAssessment) {
      onTakeAssessment?.();
      return;
    }

    onGenerate();
  };

  if (pathGenerated && learningPath) {
    return (
      <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-5 text-white sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <BookOpen size={24} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider text-violet-100">
                  Learning Path Tersedia
                </span>
              </div>

              <h2 className="text-xl font-bold sm:text-2xl">
                {path.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-violet-100">
                {path.description}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-violet-50 p-4">
              <div className="flex items-center gap-2 text-violet-600">
                <BookOpen size={17} />
                <span className="text-sm font-medium">
                  Total Materi
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {loadingSteps ? (
                  <LoaderCircle
                    size={22}
                    className="animate-spin"
                  />
                ) : (
                  steps.length
                )}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Tahapan pembelajaran
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Clock size={17} />
                <span className="text-sm font-medium">
                  Estimasi
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {learningPath.estimated_hours != null
                  ? `${learningPath.estimated_hours} jam`
                  : steps.length > 0 &&
                      steps.every(
                        (step) => step.estimated_minutes != null,
                      )
                    ? `${Math.ceil(
                        steps.reduce(
                          (total, step) =>
                            total + (step.estimated_minutes ?? 0),
                          0,
                        ) / 60,
                      )} jam`
                    : "Fleksibel"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Waktu belajar
              </p>
            </div>
          </div>

          {stepsError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />
              <div>
                <p className="font-semibold">
                  Gagal memuat tahapan belajar
                </p>
                <p className="mt-1 break-words">{stepsError}</p>
              </div>
            </div>
          )}

          {loadingSteps && (
            <div className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-gray-100 p-5 text-sm text-gray-500">
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
              Memuat tahapan belajar...
            </div>
          )}

          {!loadingSteps &&
            !stepsError &&
            steps.length === 0 && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-800">
                  Tahapan belajar belum ditemukan
                </p>
                <p className="mt-1 text-xs leading-5 text-amber-700">
                  Learning path tersedia, tetapi belum ada baris yang
                  ditemukan di learning_path_steps untuk ID learning
                  path ini. Periksa hasil generator dan akses RLS.
                </p>
              </div>
            )}

          {steps.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-3 text-sm font-semibold text-gray-800">
                Tahapan pembelajaran
              </h3>

              <div className="space-y-3">
                {steps.slice(0, 4).map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-start gap-3 rounded-xl border border-gray-100 p-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                      {step.order_sequence ?? index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {step.title || `Tahap ${index + 1}`}
                      </p>

                      {step.description && (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                          {step.description}
                        </p>
                      )}

                      {step.estimated_minutes != null && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={12} />
                          {step.estimated_minutes} menit
                        </p>
                      )}

                      {step.material_id ? (
                        <p className="mt-1 text-xs text-emerald-600">
                          Materi terhubung
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-amber-600">
                          Materi belum terhubung
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {steps.length > 4 && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  +{steps.length - 4} tahapan lainnya
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onContinue}
            disabled={!onContinue}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7560B5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#62509B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Lanjutkan belajar
            <ArrowRight size={17} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
            <Sparkles size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900">
              Buat Learning Path dengan AI
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Dapatkan jalur belajar personal berdasarkan tujuan dan
              hasil tes diagnostikmu. AI akan membantu menyusun materi
              secara bertahap.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
            <Target
              size={18}
              className="mt-0.5 shrink-0 text-violet-600"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Sesuai tujuan belajarmu
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Materi disusun berdasarkan kemampuan awal dan target
                yang ingin kamu capai.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
            <BookOpen
              size={18}
              className="mt-0.5 shrink-0 text-violet-600"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Tahapan belajar terstruktur
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Pelajari materi secara berurutan, dari dasar hingga
                tahap lanjutan yang sesuai.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrimaryAction}
          disabled={
            generating ||
            (!hasAssessment && !onTakeAssessment) ||
            (hasAssessment && !onGenerate)
          }
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7560B5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#62509B] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generating ? (
            <>
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
              Sedang membuat learning path...
            </>
          ) : hasAssessment ? (
            <>
              <Sparkles size={17} />
              Generate Learning Path
              <ArrowRight size={17} />
            </>
          ) : (
            <>
              <Target size={17} />
              Ikuti Tes Diagnostik
              <ArrowRight size={17} />
            </>
          )}
        </button>

        <p className="mt-3 text-center text-xs text-gray-400">
          {generating
            ? "AI sedang menyusun tahapan belajar untukmu."
            : hasAssessment
              ? "Hasil tes diagnostikmu akan digunakan untuk menyusun jalur belajar."
              : "Selesaikan tes diagnostik terlebih dahulu agar jalur belajarmu lebih personal."}
        </p>
      </div>
    </section>
  );
}
