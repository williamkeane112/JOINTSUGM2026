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
      <section className={`${HERO_SURFACE} flex flex-col items-start justify-center`}>
        <h2 className="font-display max-w-[18ch] text-2xl leading-tight font-bold tracking-[-0.02em]! text-balance">
          Semua topikmu sudah dikuasai
        </h2>
        <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-[var(--color-cream)]/75">
          Siap tantangan baru? Pilih topik berikutnya.
        </p>
        <Link to="/topicSelect" className="btn-primary btn-sm mt-5 inline-flex items-center justify-center gap-2">
          Tambah topik
          <ArrowRight aria-hidden="true" size={16} />
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
      className={`${HERO_SURFACE} md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] md:content-center md:gap-x-8`}
    >
      <h2 className="font-display text-2xl leading-tight font-bold tracking-[-0.02em]! text-balance md:col-start-1 md:self-end">
        Lanjut ke {name}
      </h2>

      {/* Mastery block: right column from md, between heading and reason below md. */}
      <div className="mt-5 md:col-start-2 md:row-span-3 md:row-start-1 md:mt-0 md:self-center">
        <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
          <span aria-hidden="true" className="font-display text-5xl leading-none font-extrabold tabular-nums">
            {shown}
            <span className="text-2xl">%</span>
          </span>
          <span className={`${STATUS_BADGE[status]} badge-sm mb-1`}>{STATUS_LABEL[status]}</span>
        </div>
        <p className="sr-only">{pct}% dikuasai</p>

        {/* Mastery track: one marker shows where "Dikuasai" begins, in words rather than numbers. */}
        <div aria-hidden="true" className="relative mt-4 pb-6">
          <div className="h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full" style={{ width: `${shown}%`, background: STATUS_COLOR[status] }} />
          </div>
          <span
            className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${MASTERY_THRESHOLDS.mastered}%` }}
          >
            <span className="h-3 w-px bg-[var(--color-cream)]/60" />
            <span className="mt-0.5 text-xs text-[var(--color-cream)]/70">Dikuasai</span>
          </span>
        </div>
      </div>

      <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-[var(--color-cream)]/75 md:col-start-1">
        Penguasaanmu paling rendah di sini, dan syaratnya sudah terpenuhi.
      </p>
      <Link
        to={topicHref(topicId)}
        className="btn-primary btn-sm mt-5 inline-flex items-center justify-center gap-2 md:col-start-1 md:justify-self-start md:self-start"
      >
        Lanjutkan belajar
        <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </section>
  );
}
