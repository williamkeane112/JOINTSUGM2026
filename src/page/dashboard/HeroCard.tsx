import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MASTERY_THRESHOLDS, clampMastery, getMasteryStatus } from "../../lib/mastery";
import { topicHref } from "./dashboardLogic";
import { HERO_SURFACE, STATUS_BADGE, STATUS_COLOR, STATUS_LABEL } from "./statusStyle";
import type { Recommendation } from "./types";
import { useCountUp } from "./useCountUp";

type HeroRecommendation = Exclude<Recommendation, { kind: "empty" }>;

export default function HeroCard({ recommendation }: { recommendation: HeroRecommendation }) {
  if (recommendation.kind === "all-mastered") {
    return (
      <section className={HERO_SURFACE}>
        <h2 className="font-display max-w-[18ch] text-3xl leading-tight font-bold tracking-[-0.02em] text-balance sm:text-4xl">
          Semua topikmu sudah dikuasai
        </h2>
        <p className="mt-3 max-w-[44ch] text-[var(--color-cream)]/75">
          Siap tantangan baru? Pilih topik berikutnya.
        </p>
        <Link to="/topicSelect" className="btn-primary mt-6 inline-flex min-h-12 items-center justify-center gap-2">
          Tambah topik
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </section>
    );
  }

  return (
    <ContinueHero
      topicId={recommendation.topic.id}
      name={recommendation.topic.name}
      masteryPct={recommendation.topic.masteryPct}
    />
  );
}

function ContinueHero({ topicId, name, masteryPct }: { topicId: string; name: string; masteryPct: number }) {
  const pct = Math.round(clampMastery(masteryPct));
  const status = getMasteryStatus(pct);
  const shown = useCountUp(pct);

  return (
    <section
      className={`${HERO_SURFACE} md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] md:content-center md:gap-x-10`}
    >
      <h2 className="font-display text-3xl leading-tight font-bold tracking-[-0.02em] text-balance md:col-start-1 md:self-end sm:text-4xl">
        Lanjut ke {name}
      </h2>

      {/* Mastery block: right column from md, between heading and reason below md. */}
      <div className="mt-6 md:col-start-2 md:row-span-3 md:row-start-1 md:mt-0 md:self-center">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <span
            aria-hidden="true"
            className="font-display text-7xl leading-none font-extrabold tabular-nums sm:text-8xl"
          >
            {shown}
            <span className="text-4xl sm:text-5xl">%</span>
          </span>
          <span className={`${STATUS_BADGE[status]} mb-1`}>{STATUS_LABEL[status]}</span>
        </div>
        <p className="sr-only">{pct}% dikuasai</p>

        {/* Mastery track: one marker shows where "Dikuasai" begins, in words rather than numbers. */}
        <div aria-hidden="true" className="relative mt-5 pb-6">
          <div className="h-2.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full" style={{ width: `${shown}%`, background: STATUS_COLOR[status] }} />
          </div>
          <span
            className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${MASTERY_THRESHOLDS.mastered}%` }}
          >
            <span className="h-4 w-px bg-[var(--color-cream)]/60" />
            <span className="mt-0.5 text-[11px] text-[var(--color-cream)]/70">Dikuasai</span>
          </span>
        </div>      </div>

      <p className="mt-2 max-w-[44ch] text-[var(--color-cream)]/75 md:col-start-1">
        Penguasaanmu paling rendah di sini, dan syaratnya sudah terpenuhi.
      </p>
      <Link
        to={topicHref(topicId)}
        className="btn-primary mt-6 inline-flex min-h-12 items-center justify-center gap-2 md:col-start-1 md:justify-self-start md:self-start"
      >
        Lanjutkan belajar
        <ArrowRight aria-hidden="true" size={18} />
      </Link>
    </section>
  );
}
