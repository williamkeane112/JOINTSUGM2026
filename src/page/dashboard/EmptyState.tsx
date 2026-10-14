import { Link } from "react-router-dom";
import { HERO_SURFACE } from "./statusStyle";

/** Shown in the hero slot when the student has not started any topic yet. */
export default function EmptyState() {
  return (
    <section className={HERO_SURFACE}>
      <h2 className="font-display max-w-[16ch] text-3xl font-bold tracking-[-0.02em] leading-tight text-balance sm:text-4xl">
        Belum ada topik yang kamu mulai
      </h2>
      <p className="mt-3 max-w-[44ch] text-[var(--color-cream)]/75">
        Pilih satu topik, jawab beberapa soal singkat, dan kami susun jalur belajarmu.
      </p>
      <Link
        to="/topicSelect"
        className="btn-primary mt-6 inline-flex min-h-12 items-center justify-center"
      >
        Pilih topik
      </Link>
    </section>
  );
}
