import { useState } from "react";
import {
  Check,
  ChevronDown,
  Circle,
  Lightbulb,
  LockKeyhole,
  Play,
  Target,
} from "lucide-react";
import type { LessonStep } from "./types";

interface Props {
  steps: LessonStep[];
  currentStepId: string;
  completed: boolean;
  progress: number;
  onSelectStep: (step: LessonStep) => void;
}

export default function LearningStepSidebar({
  steps,
  currentStepId,
  completed,
  progress,
  onSelectStep,
}: Props) {
  const [showStepList, setShowStepList] = useState(true);
  const completedCount = steps.filter((step) => step.status === "completed").length + (completed ? 1 : 0);

  return (
    <aside className="space-y-5 xl:sticky xl:top-[92px]">
      <section className="rounded-2xl border border-[#eee8f8] bg-white p-5 shadow-[0_5px_24px_-18px_rgba(51,36,83,0.3)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-extrabold text-[#342a4b]">Progres belajar</h2>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0eaff] text-[#7956c8]">
            <Target className="h-4.5 w-4.5" />
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <div
            className="relative flex h-32 w-32 items-center justify-center rounded-full"
            style={{ background: `conic-gradient(#7956c8 ${completed ? 100 : progress}%, #f0edf5 0)` }}
          >
            <div className="flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full bg-white">
              <span className="text-2xl font-extrabold text-[#302744]">{completed ? 100 : progress}%</span>
              <span className="text-xs text-[#898197]">progres</span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#ecfbf4] p-3">
            <p className="text-xl font-extrabold text-emerald-700">{completedCount}</p>
            <p className="mt-1 text-xs text-[#687c75]">Tahap selesai</p>
          </div>
          <div className="rounded-xl bg-[#f7f5fb] p-3">
            <p className="text-xl font-extrabold text-[#342a4b]">{Math.max(steps.length - completedCount, 0)}</p>
            <p className="mt-1 text-xs text-[#898197]">Tahap tersisa</p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#eee8f8] bg-white shadow-[0_5px_24px_-18px_rgba(51,36,83,0.3)]">
        <button
          type="button"
          onClick={() => setShowStepList((value) => !value)}
          className="flex w-full items-center justify-between gap-3 p-5 text-left"
        >
          <div>
            <p className="font-extrabold text-[#342a4b]">Daftar tahapan</p>
            <p className="mt-1 text-xs text-[#898197]">
              {steps.findIndex((step) => step.id === currentStepId) + 1} dari {steps.length} tahap
            </p>
          </div>
          <ChevronDown className={`h-4 w-4 text-[#8b819d] transition ${showStepList ? "rotate-180" : ""}`} />
        </button>

        {showStepList && (
          <div className="border-t border-[#f0ebf6] px-3 pb-3">
            {steps.map((step, index) => {
              const isCurrent = step.id === currentStepId;
              const isCompleted = step.status === "completed" || (isCurrent && completed);
              const locked = step.status === "locked" && !isCurrent;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onSelectStep(step)}
                  disabled={locked}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                    isCurrent ? "bg-[#f3edff]" : locked ? "cursor-not-allowed opacity-60" : "hover:bg-[#faf8fd]"
                  }`}
                >
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    isCompleted ? "bg-emerald-100 text-emerald-700" : isCurrent ? "bg-[#7653c5] text-white" : "bg-[#f0edf5] text-[#8b819d]"
                  }`}>
                    {isCompleted ? <Check className="h-4 w-4" /> : locked ? <LockKeyhole className="h-3.5 w-3.5" /> : isCurrent ? <Play className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[10px] font-bold uppercase tracking-wide ${isCurrent ? "text-[#7653c5]" : "text-[#9a91a8]"}`}>
                      Tahap {index + 1}
                    </span>
                    <span className={`mt-1 block text-xs font-semibold leading-5 ${isCurrent ? "text-[#342a4b]" : "text-[#625b71]"}`}>
                      {step.title}
                    </span>
                    <span className="mt-1 block text-[11px] text-[#898197]">{step.duration}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#e9e0fa] bg-gradient-to-br from-[#f4efff] to-[#fffaff] p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#7956c8] shadow-sm">
          <Lightbulb className="h-5 w-5" />
        </div>
        <h3 className="mt-3 font-extrabold text-[#342a4b]">Tips belajar</h3>
        <p className="mt-2 text-sm leading-6 text-[#756b87]">
          Pelajari satu konsep dalam satu waktu. Catat hal penting dan pastikan latihan dilakukan hanya pada lingkungan yang memang kamu miliki atau diizinkan untuk diuji.
        </p>
      </section>
    </aside>
  );
}
