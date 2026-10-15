import { ArrowRight, BookOpen, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface WelcomeBannerProps {
  studentName?: string;
}

export default function WelcomeBanner({
  studentName = "Siswa",
}: WelcomeBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#29243B] p-6 text-white shadow-sm sm:p-8 lg:p-10">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#B9A7F5]/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-[#F4A6C1]/20 blur-2xl" />

      <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-[#E5DDFE]">
            <Sparkles size={15} />
            <span>Perjalanan belajarmu dimulai di sini</span>
          </div>

          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Halo, {studentName}!
            <br />
            <span className="text-[#D2C4FF]">
              Siap berkembang hari ini?
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
            Belajar sesuai kemampuanmu, pahami materi secara bertahap,
            dan temukan jalur belajar yang paling cocok untukmu bersama
            SkillPath AI.
          </p>

          <Link
            to="/topic"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F4A6C1] px-5 py-3 text-sm font-semibold text-[#29243B] transition hover:bg-[#F8BDD0] focus:outline-none focus:ring-2 focus:ring-[#F4A6C1] focus:ring-offset-2 focus:ring-offset-[#29243B]"
          >
            Mulai Belajar
            <ArrowRight size={17} />
          </Link>
        </div>

<div className="relative hidden h-64 w-80 shrink-0 items-center justify-center md:flex">
  {/* Decorative circles */}
  <div className="absolute right-8 top-5 h-44 w-44 rounded-full bg-[#9B87D5]/20 blur-2xl" />
  <div className="absolute bottom-3 left-8 h-32 w-32 rounded-full bg-[#F4A6C1]/20 blur-2xl" />

  {/* Main learning card */}
  <div className="relative w-64 rotate-[-3deg] rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-white/60">Perjalanan belajarmu</p>
        <h3 className="mt-1 text-lg font-bold text-white">
          Web Development
        </h3>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4A6C1]/20 text-[#F4A6C1]">
        <BookOpen size={21} />
      </div>
    </div>

    <div className="mt-5 space-y-3">
      {[
        { label: "HTML & Struktur", completed: true },
        { label: "CSS & Styling", completed: true },
        { label: "JavaScript", completed: false },
      ].map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
        >
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              item.completed
                ? "bg-[#A7E8C2] text-[#29243B]"
                : "border border-white/30 text-white/50"
            }`}
          >
            {item.completed ? (
              <Check size={14} />
            ) : (
              <span className="text-xs">3</span>
            )}
          </div>

          <span className="text-xs font-medium text-white/90">
            {item.label}
          </span>
        </div>
      ))}
    </div>

    <div className="mt-5">
      <div className="mb-2 flex justify-between text-xs">
        <span className="text-white/60">Progres belajar</span>
        <span className="font-semibold text-[#D2C4FF]">67%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#9B87D5] to-[#F4A6C1]" />
      </div>
    </div>
  </div>

  {/* Floating badge */}
  <div className="absolute -right-1 top-8 flex items-center gap-2 rounded-xl border border-white/15 bg-[#39304D] px-3 py-2 shadow-xl">
    <Sparkles size={17} className="text-[#D2C4FF]" />
    <span className="text-xs font-semibold text-white">
      AI Learning Path
    </span>
  </div>
</div>
      </div>
    </section>
  );
}
