import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  href?: string;
}

export default function EmptyState({
  title = "Perjalanan belajarmu dimulai di sini",
  description = "Kamu belum memiliki aktivitas belajar. Pilih topik pertamamu dan biarkan SkillPath AI membantumu belajar secara bertahap.",
  buttonLabel = "Pilih Topik Pertama",
  href = "/topicSelect",
}: EmptyStateProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#EAE2F0] bg-white px-6 py-12 text-center shadow-sm sm:px-10">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F1EBFF] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#FCE8EF] blur-3xl" />

      <div className="relative mx-auto flex max-w-lg flex-col items-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F1EBFF] text-[#7560B5]">
          <BookOpen size={35} strokeWidth={1.5} />

          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#F4A6C1] text-[#29243B]">
            <Sparkles size={16} />
          </div>
        </div>

        <h2 className="mt-6 text-xl font-bold text-[#29243B] sm:text-2xl">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-7 text-[#93879F] sm:text-base">
          {description}
        </p>

        <Link
          to={href}
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#7560B5] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#62509B] focus:outline-none focus:ring-2 focus:ring-[#9B87D5] focus:ring-offset-2"
        >
          {buttonLabel}
          <ArrowRight size={17} />
        </Link>

        <p className="mt-4 text-xs text-[#A49AAA]">
          Belajar sedikit demi sedikit, berkembang setiap hari.
        </p>
      </div>
    </section>
  );
}
