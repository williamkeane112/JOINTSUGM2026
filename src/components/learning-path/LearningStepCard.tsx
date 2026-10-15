
import { useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  LockKeyhole,
  Play,
} from "lucide-react";
import type { LearningPathStep } from "../../types/learning-path";
import LearningObjectives from "./LearningObjectives";
import LearningStepNavigation from "./LearningStepNavigation";

interface Props {
  step: LearningPathStep;
  isLast: boolean;
  actionLoading?: boolean;
  onStart: (step: LearningPathStep) => void;
  onOpen: (step: LearningPathStep) => void;
  onComplete: (step: LearningPathStep) => void;
}

const statusLabels = {
  locked: "Terkunci",
  available: "Siap dipelajari",
  in_progress: "Sedang dipelajari",
  completed: "Selesai",
};

const statusClasses = {
  locked: "bg-gray-100 text-gray-500",
  available: "bg-emerald-50 text-emerald-700",
  in_progress: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
};

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} menit`;

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  return remaining ? `${hours} jam ${remaining} menit` : `${hours} jam`;
}

export default function LearningStepCard({
  step,
  isLast,
  actionLoading = false,
  onStart,
  onOpen,
  onComplete,
}: Props) {
  const [expanded, setExpanded] = useState(
    step.status === "in_progress"
  );

  const Icon =
    step.status === "completed"
      ? Check
      : step.status === "in_progress"
        ? Play
        : step.status === "available"
          ? BookOpen
          : LockKeyhole;

  return (
    <div className="relative flex gap-3">
      {!isLast && (
        <div
          className={`absolute bottom-0 left-[19px] top-12 w-0.5 ${
            step.status === "completed"
              ? "bg-emerald-300"
              : "bg-gray-200"
          }`}
        />
      )}

      <div
        className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
          step.status === "completed"
            ? "border-emerald-600 bg-emerald-600 text-white"
            : step.status === "in_progress"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : step.status === "available"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-gray-200 bg-gray-100 text-gray-400"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <article
        className={`mb-5 min-w-0 flex-1 rounded-xl border p-4 transition ${
          step.status === "in_progress"
            ? "border-emerald-300 bg-emerald-50/40"
            : "border-gray-200 bg-white"
        }`}
      >
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className="flex w-full items-start justify-between gap-3 text-left"
        >
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500">
              TAHAP {step.order_sequence}
            </p>

            <h3 className="mt-1 font-semibold text-gray-900">
              {step.title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[step.status]}`}
              >
                {statusLabels[step.status]}
              </span>

              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Clock3 className="h-3.5 w-3.5" />
                {formatDuration(step.estimated_minutes)}
              </span>
            </div>
          </div>

          {expanded ? (
            <ChevronUp className="mt-1 h-5 w-5 shrink-0 text-gray-400" />
          ) : (
            <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-gray-400" />
          )}
        </button>

        {expanded && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            {step.description && (
              <p className="text-sm leading-6 text-gray-600">
                {step.description}
              </p>
            )}

            <LearningObjectives objectives={step.learning_objectives ?? []} />

            <LearningStepNavigation
              step={step}
              loading={actionLoading}
              onStart={() => onStart(step)}
              onOpen={() => onOpen(step)}
              onComplete={() => onComplete(step)}
            />
          </div>
        )}
      </article>
    </div>
  );
}
