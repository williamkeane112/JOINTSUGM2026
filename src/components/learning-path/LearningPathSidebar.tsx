
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import type {
  LearningPathStep,
  LearningProgressSummary,
} from "../../types/learning-path";
import LearningPathProgress from "./LearningPathProgress";

interface Props {
  progress: LearningProgressSummary | null;
  currentStep: LearningPathStep | null;
  allCompleted: boolean;
  actionLoading?: boolean;
  onContinue: () => void;
}

export default function LearningPathSidebar({
  progress,
  currentStep,
  allCompleted,
  actionLoading = false,
  onContinue,
}: Props) {
  return (
    <aside className="space-y-5">
      <LearningPathProgress progress={progress} />

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        {allCompleted ? (
          <>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Trophy className="h-6 w-6" />
            </div>

            <h2 className="mt-4 font-bold">Selamat, kamu berhasil!</h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Semua tahap dalam learning path ini telah kamu selesaikan.
              Pertahankan kebiasaan belajarmu.
            </p>
          </>
        ) : (
          <>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Target className="h-6 w-6" />
            </div>

            <h2 className="mt-4 font-bold">Lanjutkan belajar</h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {currentStep
                ? `Tahap berikutnya: ${currentStep.title}.`
                : "Belum ada tahap yang bisa dikerjakan saat ini."}
            </p>

            {currentStep && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={onContinue}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {currentStep.status === "available"
                  ? "Mulai tahap berikutnya"
                  : "Lanjutkan materi"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-center gap-2 text-blue-800">
          <Sparkles className="h-5 w-5" />
          <h2 className="font-bold">Tips belajar</h2>
        </div>

        <ul className="mt-3 space-y-3 text-sm leading-6 text-blue-900/80">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />
            Pelajari materi secara berurutan.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />
            Praktikkan konsep sebelum melanjutkan ke tahap lain.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />
            Gunakan target waktu yang realistis dan konsisten.
          </li>
        </ul>
      </section>
    </aside>
  );
}
