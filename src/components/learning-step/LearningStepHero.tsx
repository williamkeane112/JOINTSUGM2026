import { Clock3, Sparkles, Target } from "lucide-react";

interface Props {
  title: string;
  duration: string;
}

export default function LearningStepHero({ title, duration }: Props) {
  return (
    <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#39285f] via-[#6546a8] to-[#9474d7] p-5 text-white shadow-[0_18px_45px_-25px_rgba(76,48,130,0.55)] sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border-[30px] border-white/[0.08]" />
      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-purple-50"><Sparkles className="h-3.5 w-3.5" />Materi pembelajaran personal</div>
        <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-purple-100 sm:text-[15px]">Materi disusun oleh AI berdasarkan tujuan belajar dan tahap yang sedang kamu pelajari.</p>
        <div className="mt-5 flex flex-wrap gap-2.5 text-sm">
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2"><Clock3 className="h-4 w-4" />{duration}</span>
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2"><Target className="h-4 w-4" />Praktik terarah</span>
        </div>
      </div>
    </section>
  );
}
