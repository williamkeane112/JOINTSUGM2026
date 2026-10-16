import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTAINER } from "./landingStyles";

export default function ClosingSection() {
  return (
    // Closing + footer share the last screen: 5.25rem is the footer's height.
    <section
      aria-labelledby="closing-title"
      className="py-16 sm:py-24 lg:flex lg:min-h-[calc(100svh-5.25rem)] lg:flex-col lg:justify-center"
    >
      <div className={`${CONTAINER} flex flex-col items-center text-center`}>
        {/* Small echo of the hero orbit, so the page closes in the same world it opened in. */}
        <div
          aria-hidden="true"
          className="relative mb-8 grid size-24 place-items-center rounded-full border border-[#ff90b855] bg-white"
        >
          <span className="absolute inset-[11px] rounded-full border border-dashed border-[#ffb1c6]" />
          <span className="size-3 rounded-full bg-[var(--color-pink)]" />
          <span className="absolute top-5 right-1 size-2 rounded-full bg-[#a88af9]" />
          <span className="absolute bottom-1.5 left-4 size-2 rounded-full bg-[#ffdc7c]" />
        </div>
        <h2
          id="closing-title"
          className="font-display max-w-[18ch] text-[clamp(28px,3.6vw,44px)] leading-[1.08] font-extrabold tracking-[-0.03em]! text-balance"
        >
          Mulai dari yang belum kamu kuasai.
        </h2>
        <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-[var(--color-muted)]">
          Daftar dengan email, pilih topik, dan jawab beberapa soal. Jalurmu siap dalam beberapa menit.
        </p>
        <Link to="/auth" className="btn-primary mt-8 inline-flex items-center justify-center gap-2">
          Mulai belajar
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}
