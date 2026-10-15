import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  learningPathId?: string;
  currentStep: number;
  totalSteps: number;
}

export default function LearningStepTopBar({
  learningPathId,
  currentStep,
  totalSteps,
}: Props) {
  const navigate = useNavigate();

  function goBack() {
    if (learningPathId) {
      navigate(`/learning-path/${learningPathId}`);
    } else {
      navigate(-1);
    }
  }

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[68px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#625b71] transition hover:bg-[#f2eef9] hover:text-[#6d4bc3]"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">
            Kembali ke learning path
          </span>
          <span className="sm:hidden">Kembali</span>
        </button>

        <div className="hidden shrink-0 items-center gap-2 rounded-xl bg-[#f3edff] px-3 py-2 text-xs font-bold text-[#7653c5] sm:flex">
          <BookOpen className="h-4 w-4 shrink-0" />
          <span>
            Tahap {currentStep} dari {totalSteps}
          </span>
        </div>
      </div>
    </header>
  );
}
