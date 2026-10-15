import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  learningPathId?: string;
  nextStepId?: string;
  onNextStep?: () => void;
}

export default function LearningStepCompleteNotice({
  learningPathId,
  nextStepId,
  onNextStep,
}: Props) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      <div>
        <p className="font-bold text-emerald-800">Tahap selesai!</p>
        <p className="mt-1 text-sm leading-6 text-emerald-700">
          Tahap ini ditandai selesai secara lokal. Integrasi penyimpanan progres ke Supabase dapat ditambahkan berikutnya.
        </p>
        {nextStepId && onNextStep ? (
          <button
            type="button"
            onClick={onNextStep}
            className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:underline"
          >
            Lanjut ke tahap berikutnya <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <Link
            to={`/learning-path/${learningPathId}`}
            className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:underline"
          >
            Kembali ke learning path <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
