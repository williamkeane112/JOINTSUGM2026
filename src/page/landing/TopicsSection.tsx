import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CATALOG } from "./catalog";
import { CONTAINER, SECTION, SECTION_LEAD, SECTION_TITLE } from "./landingStyles";

const ALL = "Semua";

export default function TopicsSection() {
  const [filter, setFilter] = useState<string>(ALL);
  const filters = [ALL, ...CATALOG.map((category) => category.name)];
  const shown = filter === ALL ? CATALOG : CATALOG.filter((category) => category.name === filter);
  const availableCount = CATALOG.flatMap((category) => category.topics).filter((topic) => topic.available).length;

  return (
    <section id="topik" aria-labelledby="topik-title" className={`${SECTION} bg-white`}>
      <div className={CONTAINER}>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <h2 id="topik-title" className={SECTION_TITLE}>
              Mulai dari pemrograman, lalu bertambah
            </h2>
            <p className={SECTION_LEAD}>
              Topik dibuka satu per satu, setelah soal dan materinya lengkap dan dicek. Sekarang {availableCount} topik
              siap dipakai.
            </p>
          </div>

          <div role="group" aria-label="Saring kategori" className="flex flex-wrap gap-2">
            {filters.map((name) => {
              const active = name === filter;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(name)}
                  className={`inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold transition-colors pointer-coarse:h-11 ${
                    active
                      ? "bg-[var(--color-night)] text-[var(--color-cream)]"
                      : "bg-[var(--color-cream)] text-[var(--color-ink)] ring-1 ring-[var(--color-line)] hover:bg-[#fff0f5]"
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
          {shown.map((category) => (
            <div key={category.name} className="grid gap-3 py-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8">
              <h3 className="font-display pt-3 text-base font-bold tracking-[-0.01em]!">{category.name}</h3>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {category.topics.map((topic) =>
                  topic.available ? (
                    <li key={topic.name}>
                      <Link
                        to="/auth"
                        className="group flex h-full items-start justify-between gap-3 rounded-[var(--radius-card)] bg-[var(--color-cream)] p-4 ring-1 ring-[var(--color-mastered-line)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
                      >
                        <span>
                          <span className="block text-base font-semibold">{topic.name}</span>
                          <span className="mt-1 block text-sm text-[var(--color-muted)]">{topic.blurb}</span>
                          <span className="badge-mastered badge-sm mt-3 inline-block">Tersedia</span>
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          size={18}
                          className="mt-1 shrink-0 text-[var(--color-pink-deep)] transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    </li>
                  ) : (
                    <li key={topic.name} className="rounded-[var(--radius-card)] p-4 ring-1 ring-[var(--color-line)]">
                      <span className="block text-base font-semibold text-[var(--color-ink)]/80">{topic.name}</span>
                      <span className="mt-1 block text-sm text-[var(--color-muted)]">{topic.blurb}</span>
                      <span className="badge-locked badge-sm mt-3 inline-block">Segera hadir</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
