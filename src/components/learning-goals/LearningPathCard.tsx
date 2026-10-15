import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Layers3,
  Sparkles,
} from "lucide-react";

interface LearningPathCardProps {
  learningPath: Record<string, any> | null;
  pathGenerated: boolean;
  hasAssessment: boolean;
  generating?: boolean;
  onGenerate: () => void;
  onContinue?: () => void;
}

function readPathContent(path: Record<string, any>) {
  const content =
    path.modules ??
    path.steps ??
    path.learning_path ??
    path.path ??
    path.content;

  if (Array.isArray(content)) return content;

  if (content && typeof content === "object") {
    const nested =
      content.modules ??
      content.steps ??
      content.learning_path;

    if (Array.isArray(nested)) return nested;
  }

  return [];
}

export default function LearningPathCard({
  learningPath,
  pathGenerated,
  hasAssessment,
  generating = false,
  onGenerate,
  onContinue,
}: LearningPathCardProps) {
  const modules = learningPath ? readPathContent(learningPath) : [];

  const title =
    learningPath?.title ??
    learningPath?.name ??
    "Learning Path Personal";

  const description =
    learningPath?.description ??
    learningPath?.summary ??
    "Materi belajar disusun untuk membantu kamu mencapai tujuan belajar secara bertahap.";

  if (pathGenerated && learningPath) {
    return (
      <section className="overflow-hidden rounded-2xl border border-[#EAE2F0] bg-white">
        <div className="flex items-start justify-between gap-3 border-b border-[#F0E9F2] p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EDE7FF] text-[#7560B5]">
              <BookOpen size={21} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-[#30213F]">
                  Learning Path Kamu
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F7EF] px-2 py-1 text-[11px] font-semibold text-[#278456]">
                  <CheckCircle2 size={12} />
                  Dibuat
                </span>
              </div>

              <p className="mt-1 text-sm text-[#93879F]">
                Jalur belajar personalmu sudah siap.
              </p>
            </div>
          </div>

          <Sparkles
            size={19}
            className="shrink-0 text-[#F43F91]"
          />
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-[#30213F]">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#766C80]">
            {description}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-[#F8F5FF] px-3 py-2 text-sm text-[#594477]">
              <Layers3 size={16} />
              {modules.length > 0
                ? `${modules.length} modul`
                : "Jalur belajar tersedia"}
            </div>

            {learningPath?.estimated_duration && (
              <div className="flex items-center gap-2 rounded-xl bg-[#FFF5F9] px-3 py-2 text-sm text-[#A64F78]">
                <Clock3 size={16} />
                {String(learningPath.estimated_duration)}
              </div>
            )}
          </div>

          {modules.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#93879F]">
                Tahapan pembelajaran
              </p>

              <div className="space-y-2">
                {modules.slice(0, 3).map((module, index) => {
                  const name =
                    typeof module === "string"
                      ? module
                      : module?.title ??
                        module?.name ??
                        module?.topic ??
                        `Modul ${index + 1}`;

                  return (
                    <div
                      key={`${String(name)}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-[#F0E9F2] px-3 py-3"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#F1EBFF] text-xs font-bold text-[#7560B5]">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-[#493763]">
                        {String(name)}
                      </span>
                    </div>
                  );
                })}

                {modules.length > 3 && (
                  <p className="pt-1 text-xs text-[#93879F]">
                    +{modules.length - 3} tahapan lainnya
                  </p>
                )}
              </div>
            </div>
          )}

          {onContinue && (
            <button
              type="button"
              onClick={onContinue}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7560B5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#62509B]"
            >
              Lanjutkan belajar
              <ArrowRight size={17} />
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#EAE2F0] bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F1EBFF] text-[#7560B5]">
          <Sparkles size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-[#30213F]">
            Buat Learning Path
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#93879F]">
            {hasAssessment
              ? "Hasil tes diagnostikmu siap digunakan untuk menyusun jalur belajar yang lebih sesuai dengan kemampuanmu."
              : "Mulai dengan tes diagnostik agar jalur belajar dapat disesuaikan dengan kemampuan awalmu."}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-[#FAF7FF] p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-[#7560B5]">
            {hasAssessment ? (
              <CheckCircle2 size={18} />
            ) : (
              <BookOpen size={18} />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-[#493763]">
              {hasAssessment
                ? "Tes diagnostik selesai"
                : "Tes diagnostik diperlukan"}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#93879F]">
              {hasAssessment
                ? "Kamu dapat membuat jalur belajar berdasarkan hasil tes ini."
                : "Selesaikan tes terlebih dahulu untuk mengetahui kemampuan awalmu."}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!hasAssessment || generating}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7560B5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#62509B] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {generating ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Menyiapkan learning path...
          </>
        ) : (
          <>
            <Sparkles size={17} />
            {hasAssessment
              ? "Generate Learning Path"
              : "Ikuti Tes Diagnostik"}
            {!hasAssessment && <ArrowRight size={16} />}
          </>
        )}
      </button>
    </section>
  );
}
