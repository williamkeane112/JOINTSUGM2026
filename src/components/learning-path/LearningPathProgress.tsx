
import { CheckCircle2, Clock3, LockKeyhole } from "lucide-react";
import type { LearningProgressSummary } from "../../types/learning-path";

interface Props {
  progress: LearningProgressSummary | null;
}

export default function LearningPathProgress({ progress }: Props) {
  const percentage = Math.min(
    100,
    Math.max(0, progress?.progress_percentage ?? 0)
  );

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="font-bold">Progres belajar</h2>

      <div className="mt-5 flex justify-center">
        <div className="relative flex h-36 w-36 items-center justify-center">
          <svg
            viewBox="0 0 120 120"
            className="h-full w-full -rotate-90"
            role="img"
            aria-label={`Progres belajar ${percentage}%`}
          >
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="currentColor"
              className="text-gray-100"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="currentColor"
              className="text-emerald-500"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 301.59} 301.59`}
            />
          </svg>

          <div className="absolute text-center">
            <p className="text-3xl font-bold">{percentage}%</p>
            <p className="text-xs text-gray-500">terselesaikan</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-2xl font-bold text-emerald-700">
            {progress?.completed_steps ?? 0}
          </p>
          <p className="mt-1 text-xs text-gray-600">Tahap selesai</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-2xl font-bold text-gray-800">
            {Math.max(
              0,
              (progress?.total_steps ?? 0) -
                (progress?.completed_steps ?? 0)
            )}
          </p>
          <p className="mt-1 text-xs text-gray-600">Tahap tersisa</p>
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Siap dipelajari
          </span>
          <span className="font-semibold">
            {progress?.available_steps ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <Clock3 className="h-4 w-4 text-blue-600" />
            Sedang dipelajari
          </span>
          <span className="font-semibold">
            {progress?.in_progress_steps ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-gray-500">
            <LockKeyhole className="h-4 w-4" />
            Terkunci
          </span>
          <span className="font-semibold">
            {progress?.locked_steps ?? 0}
          </span>
        </div>
      </div>
    </section>
  );
}
