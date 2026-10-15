import {
  ArrowLeft,
  BookOpen,
  Clock3,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { LearningPath } from "../../types/learning-path";

interface Props {
  learningPath: LearningPath;
  onReload: () => void;
  loading?: boolean;
}

const levelLabels: Record<string, string> = {
  beginner: "Pemula",
  intermediate: "Menengah",
  advanced: "Lanjutan",
};

export default function LearningPathHeader({
  learningPath,
  onReload,
  loading = false,
}: Props) {
  const navigate = useNavigate();

  const totalSteps =
    learningPath.total_steps ??
    learningPath.learning_path_steps?.length ??
    0;

  return (
    <div>
      {/* Navigasi di atas card hero */}
      <div className="mx-6 mt-4 flex items-center justify-between sm:mx-6 xl:mx-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#625b71] transition hover:bg-[#f2eef9] hover:text-[#6d4bc3]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>

        <button
          type="button"
          onClick={onReload}
          disabled={loading}
          aria-label="Muat ulang learning path"
          title="Muat ulang"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9e3f2] bg-white text-[#716881] transition hover:border-[#d7c8f5] hover:bg-[#f6f1ff] hover:text-[#7552c7] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Hero card */}
      <section className="relative mx-4 mt-3 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#39285f] via-[#6546a8] to-[#9474d7] p-5 text-white shadow-[0_18px_45px_-25px_rgba(76,48,130,0.55)] sm:mx-6 sm:mt-4 sm:p-6 lg:p-8 xl:mx-20">
        {/* Dekorasi background */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border-[30px] border-white/[0.08]" />

        <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/[0.06] blur-2xl" />

        <div className="relative z-10 max-w-4xl">
          {/* Label */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-purple-50">
            <Sparkles className="h-3.5 w-3.5" />
            Jalur belajar personal
          </div>

          {/* Judul */}
          <h1 className="mt-4 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            {learningPath.title}
          </h1>

          {/* Deskripsi */}
          <p className="mt-2 max-w-3xl text-sm leading-6 text-purple-100 sm:text-[15px]">
            {learningPath.description ||
              "Ikuti tahapan pembelajaran secara bertahap dan tingkatkan kemampuanmu."}
          </p>

          {/* Informasi learning path */}
          <div className="mt-5 flex flex-wrap gap-2.5 text-sm">
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 font-medium">
              <Target className="h-4 w-4 text-purple-200" />
              {levelLabels[learningPath.difficulty_level] ??
                learningPath.difficulty_level}
            </span>

            {learningPath.estimated_hours != null && (
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 font-medium">
                <Clock3 className="h-4 w-4 text-purple-200" />
                {learningPath.estimated_hours} jam estimasi
              </span>
            )}

            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 font-medium">
              <BookOpen className="h-4 w-4 text-purple-200" />
              {totalSteps} tahap belajar
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
