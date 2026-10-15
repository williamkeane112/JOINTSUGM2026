
import { BookOpen, Sparkles } from "lucide-react";

export default function TopicsHeader() {
  return (
    <header className="relative mb-7 overflow-hidden rounded-3xl bg-[#30213F] px-6 py-7 text-white shadow-[0_12px_35px_rgba(48,33,63,0.12)] sm:px-8 sm:py-9">
      <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#7560B5]/25 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 right-32 h-40 w-40 rounded-full bg-[#F43F91]/15 blur-2xl" />

      <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
            <Sparkles size={14} className="text-[#F9A8D4]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/90">
              SkillPath AI
            </span>
          </div>

          <h1 className="max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">
            Apa yang ingin kamu pelajari?
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
            Temukan topik yang sesuai dengan minatmu dan bangun jalur belajar
            yang menyesuaikan kemampuanmu.
          </p>
        </div>

        <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/10 sm:flex">
          <BookOpen size={38} strokeWidth={1.5} className="text-[#F9A8D4]" />
        </div>
      </div>
    </header>
  );
}
