import SkillPathList from "./SkillPathList";
import { DEMO_SKILLS, RAKA_ANSWERS, buildDemoPath, computeSkillResults } from "./demoScript";

// Computed by BKT from Raka's answers, never typed in by hand.
const RESULTS = computeSkillResults(DEMO_SKILLS, RAKA_ANSWERS);
const PATH = buildDemoPath(RESULTS);

/** Hero product shot: the final result of the demo, rendered with the real components. */
export default function PathPreview() {
  const first = PATH.steps[0];

  return (
    <figure className="relative rounded-2xl bg-[var(--color-cream)] p-5 text-[var(--color-ink)] shadow-[0_28px_60px_rgba(6,0,14,0.5)] sm:p-6">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <p className="font-display text-base font-bold tracking-[-0.01em]!">Jalur Raka</p>
        <p className="text-xs text-[var(--color-muted)]">Dasar Pemrograman</p>
      </div>
      <SkillPathList path={PATH} label="Jalur belajar Raka" />
      <figcaption className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
        <strong className="font-semibold text-[var(--color-ink)]">
          {PATH.skipped.length} dari {RESULTS.length} skill dilewati.
        </strong>{" "}
        {first ? `Raka langsung mulai dari ${first.name}.` : "Raka bisa lanjut ke topik berikutnya."}
      </figcaption>
    </figure>
  );
}
