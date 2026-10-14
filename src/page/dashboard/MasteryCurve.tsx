import { useEffect, useRef, useState } from "react";
import type { CurvePoint } from "../../lib/algorithms/bkt";
import { MASTERY_THRESHOLDS, clampMastery } from "../../lib/mastery";

const PAD = { top: 30, right: 74, bottom: 30, left: 34 };
/** The target line runs past the last point so its label never collides with the final value label. */
const TARGET_OVERHANG = 16;
const AXIS_TICKS = [0, 50, 100];

const VIOLET = "var(--color-violet)";
const MUTED = "var(--color-muted)";
const LINE = "var(--color-line)";
const TARGET = "var(--color-mastered)";
const TARGET_INK = "var(--color-mastered-ink)";

/** Tracks the rendered width so SVG text stays at a readable pixel size on every screen. */
function useElementWidth(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);

  useEffect(() => {
    const element = ref.current;
    if (!active || !element) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(240, Math.floor(entry.contentRect.width)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [active]);

  return { ref, width };
}

interface MasteryCurveProps {
  topicName: string;
  points: CurvePoint[];
}

export default function MasteryCurve({ topicName, points }: MasteryCurveProps) {
  const hasCurve = points.length >= 2;
  const { ref, width } = useElementWidth(hasCurve);

  const height = width < 520 ? 200 : 240;
  const plotWidth = width - PAD.left - PAD.right;
  const plotHeight = height - PAD.top - PAD.bottom;
  const x = (index: number) => PAD.left + (index / (points.length - 1)) * plotWidth;
  const y = (pct: number) => PAD.top + plotHeight * (1 - clampMastery(pct) / 100);

  const first = points[0];
  const last = points[points.length - 1];
  // Every point is an answer. The left edge is "Mulai" only while it is answer 1; a trimmed history says which answer it starts at.
  const startLabel = first?.answer === 1 ? "Mulai" : `Soal ${first?.answer}`;
  const summary = hasCurve
    ? `Grafik penguasaan ${topicName}: ${last.masteryPct >= first.masteryPct ? "naik" : "turun"} dari ${Math.round(first.masteryPct)}% setelah soal ${first.answer} ke ${Math.round(last.masteryPct)}% setelah soal ${last.answer}. Garis hijau menandai batas dikuasai.`
    : "";

  return (
    <section className="card p-5 sm:p-6">
      <h2 className="font-display text-lg font-bold">Penguasaan per soal</h2>
      <p className="mt-0.5 text-sm text-[var(--color-muted)]">{topicName}</p>

      {!hasCurve ? (
        <p className="mt-6 text-[var(--color-muted)]">
          Jawab beberapa soal dan grafik penguasaanmu muncul di sini.
        </p>
      ) : (
        <>
          <div ref={ref} className="mt-3">
            <svg width={width} height={height} role="img" aria-label={summary} className="block max-w-full overflow-visible">
              {AXIS_TICKS.map((tick) => (
                <g key={tick}>
                  <line
                    x1={PAD.left}
                    x2={PAD.left + plotWidth}
                    y1={y(tick)}
                    y2={y(tick)}
                    strokeWidth={1.5}
                    strokeDasharray={tick === 0 ? undefined : "2 6"}
                    style={{ stroke: LINE }}
                  />
                  <text x={PAD.left - 10} y={y(tick) + 4} fontSize={11} textAnchor="end" style={{ fill: MUTED }}>
                    {tick}
                  </text>
                </g>
              ))}

              <line
                x1={PAD.left}
                x2={PAD.left + plotWidth + TARGET_OVERHANG}
                y1={y(MASTERY_THRESHOLDS.mastered)}
                y2={y(MASTERY_THRESHOLDS.mastered)}
                strokeWidth={1.5}
                strokeDasharray="5 5"
                style={{ stroke: TARGET }}
              />
              <text
                x={PAD.left + plotWidth + TARGET_OVERHANG + 6}
                y={y(MASTERY_THRESHOLDS.mastered) + 4}
                fontSize={12}
                fontWeight={600}
                style={{ fill: TARGET_INK }}
              >
                Dikuasai
              </text>

              <polyline
                fill="none"
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                points={points.map((p, i) => `${x(i)},${y(p.masteryPct)}`).join(" ")}
                style={{ stroke: VIOLET }}
              />

              {points.map((p, i) => {
                const isLast = i === points.length - 1;
                return (
                  <circle
                    key={p.answer}
                    cx={x(i)}
                    cy={y(p.masteryPct)}
                    r={isLast ? 6 : 4}
                    strokeWidth={2}
                    style={{ stroke: VIOLET, fill: p.correct ? VIOLET : "#fff" }}
                  />
                );
              })}

              <text
                x={x(points.length - 1)}
                y={y(last.masteryPct) - 14}
                textAnchor="middle"
                fontSize={13}
                fontWeight={700}
                strokeWidth={4}
                paintOrder="stroke"
                style={{ fill: "var(--color-ink)", stroke: "#fff" }}
              >
                {Math.round(last.masteryPct)}%
              </text>

              <text x={PAD.left} y={height - 8} fontSize={12} style={{ fill: MUTED }}>
                {startLabel}
              </text>
              <text x={PAD.left + plotWidth} y={height - 8} fontSize={12} textAnchor="end" style={{ fill: MUTED }}>
                Terbaru
              </text>
            </svg>
          </div>

          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--color-muted)]">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3 rounded-full bg-[var(--color-violet)]" />
              Jawaban benar
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3 rounded-full border-2 border-[var(--color-violet)] bg-white" />
              Jawaban salah
            </li>
          </ul>
        </>
      )}
    </section>
  );
}
