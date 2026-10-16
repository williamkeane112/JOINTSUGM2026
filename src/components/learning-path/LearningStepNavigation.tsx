
import {
  ArrowRight,
  BookOpen,
  Check,
  LoaderCircle,
  Play,
} from "lucide-react";
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
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700">
          <Check className="h-4 w-4" />
          Sudah selesai
        </span>

        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
        >
          <BookOpen className="h-4 w-4" />
          Baca ulang materi
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {step.status === "available" ? (
        <button
          type="button"
          disabled={loading}
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            Lanjutkan materi
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onComplete}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
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
