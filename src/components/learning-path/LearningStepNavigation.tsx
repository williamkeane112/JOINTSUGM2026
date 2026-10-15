
import { ArrowRight, Check, LoaderCircle, Play } from "lucide-react";
import type { LearningPathStep } from "../../types/learning-path";

interface Props {
  step: LearningPathStep;
  loading?: boolean;
  onStart: () => void;
  onOpen: () => void;
  onComplete: () => void;
}

export default function LearningStepNavigation({
  step,
  loading = false,
  onStart,
  onOpen,
  onComplete,
}: Props) {
  if (step.status === "locked") {
    return (
      <p className="mt-4 text-sm text-gray-500">
        Selesaikan tahap sebelumnya untuk membuka bagian ini.
      </p>
    );
  }

  if (step.status === "completed") {
    return (
      <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
        <Check className="h-4 w-4" />
        Sudah selesai
      </span>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {step.status === "available" ? (
        <button
          type="button"
          disabled={loading}
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Mulai belajar
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Lanjutkan materi
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onComplete}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Tandai selesai
          </button>
        </>
      )}
    </div>
  );
}
