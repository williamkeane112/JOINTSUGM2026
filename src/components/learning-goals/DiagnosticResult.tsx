import { useState } from "react";
import { ChevronDown, ChevronUp, Trophy } from "lucide-react";
import SkillAnalysis from "./SkillAnalysis";

export type DiagnosticAssessment = {
  id: string;
  score: number | null;
  total_questions: number;
  skill_analysis: unknown;
  status: string;
  completed_at: string | null;
  created_at: string;
};

interface Props {
  assessment: DiagnosticAssessment;
  pathGenerated: boolean;
  onRetake?: () => void;
}

export default function DiagnosticResult({
  assessment,
  pathGenerated,
  onRetake,
}: Props) {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const percent =
    assessment.score !== null && assessment.total_questions > 0
      ? Math.round(
          (assessment.score / assessment.total_questions) * 100,
        )
      : null;

  const date = assessment.completed_at ?? assessment.created_at;

  return (
    <section className="rounded-2xl border border-[#EAE2F0] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F7EF] text-[#2D9060]">
            <Trophy size={20} />
          </div>

          <div>
            <h2 className="font-bold text-[#30213F]">
              Hasil Tes Diagnostik
            </h2>
            <p className="mt-0.5 text-xs text-[#93879F]">
              {new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(date))}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-bold leading-none text-[#7560B5]">
              {percent === null ? "—" : `${percent}%`}
            </p>
            <p className="mt-1 text-xs text-[#93879F]">
              {assessment.score ?? "—"} dari {assessment.total_questions}
            </p>
          </div>

          <div className="h-10 w-1.5 overflow-hidden rounded-full bg-[#EAE2F0]">
            <div
              className="w-full rounded-full bg-[#7560B5]"
              style={{
                height: `${Math.max(0, Math.min(100, percent ?? 0))}%`,
                marginTop: `${100 - Math.max(0, Math.min(100, percent ?? 0))}%`,
              }}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowAnalysis((value) => !value)}
        aria-expanded={showAnalysis}
        className="mt-4 flex w-full items-center justify-between border-t border-[#F0E9F2] pt-3 text-sm font-semibold text-[#7560B5] hover:text-[#59458F]"
      >
        {showAnalysis ? "Sembunyikan analisis" : "Lihat analisis kemampuan"}
        {showAnalysis ? (
          <ChevronUp size={17} />
        ) : (
          <ChevronDown size={17} />
        )}
      </button>

      {showAnalysis && (
        <div className="mt-3">
          <SkillAnalysis value={assessment.skill_analysis} />
        </div>
      )}

      {pathGenerated ? (
        <p className="mt-3 text-xs text-[#93879F]">
          Tes dikunci karena learning path sudah dibuat.
        </p>
      ) : onRetake ? (
        <button
          type="button"
          onClick={onRetake}
          className="mt-3 text-sm font-semibold text-[#7560B5] hover:underline"
        >
          Ulangi tes diagnostik
        </button>
      ) : null}
    </section>
  );
}
