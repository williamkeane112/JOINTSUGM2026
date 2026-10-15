import { Check, Pause, Play, RotateCcw, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { STATUS_COLOR } from "../dashboard/statusStyle";
import SkillPathList from "./SkillPathList";
import {
  DEMO_FRAME_COUNT,
  DEMO_SKILLS,
  RAKA_ANSWERS,
  buildDemoPath,
  computeSkillResults,
  type DemoSkill,
  type SkillResult,
} from "./demoScript";
import { CONTAINER, SECTION, SECTION_LEAD, SECTION_TITLE } from "./landingStyles";
import { useDemoPlayback } from "./useDemoPlayback";

const LAST_FRAME = DEMO_FRAME_COUNT - 1;
const QUESTION_COUNT = DEMO_SKILLS.length;

const STAGES = [
  { title: "Pilih topik", body: "Satu topik, beberapa skill kecil di dalamnya.", frame: 0 },
  { title: "Jawab beberapa soal", body: "Satu soal per skill. Tiap jawaban menggeser perkiraan penguasaanmu.", frame: 1 },
  { title: "Dapat jalur sendiri", body: "Yang sudah dikuasai dilewati. Yang paling lemah dipelajari lebih dulu.", frame: LAST_FRAME },
] as const;

/** Mount-in transition for whatever the current frame shows (CSS @starting-style, no library). */
const ENTER = "transition duration-300 ease-out starting:translate-y-2 starting:opacity-0";

function stageOf(frame: number) {
  if (frame === 0) return 0;
  return frame < LAST_FRAME ? 1 : 2;
}

function joinNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} dan ${names[names.length - 1]}`;
}

function pathSentence(results: SkillResult[]) {
  const path = buildDemoPath(results);
  const skipped = joinNames(path.skipped.map((s) => s.name));
  const first = path.steps[0]?.name;
  if (!first) return "Semua skill sudah dikuasai. Raka bisa lanjut ke topik berikutnya.";
  if (!skipped) return `Belum ada yang dikuasai, jadi tidak ada yang dilewati. Raka mulai dari ${first}.`;
  return `${skipped} sudah dikuasai, jadi dilewati. Raka langsung mulai dari ${first}.`;
}

export default function DemoSection() {
  const panelRef = useRef<HTMLDivElement>(null);
  const { frame, playing, finished, toggle, replay, goTo } = useDemoPlayback(panelRef, DEMO_FRAME_COUNT);
  const [answers, setAnswers] = useState<boolean[]>(() => [...RAKA_ANSWERS]);

  // The scripted playback always shows Raka's real answers; edits apply only on the final, interactive frame.
  const shownAnswers = finished ? answers : RAKA_ANSWERS;
  const results = useMemo(() => computeSkillResults(DEMO_SKILLS, shownAnswers), [shownAnswers]);
  const path = useMemo(() => buildDemoPath(results), [results]);
  const edited = answers.some((answer, i) => answer !== RAKA_ANSWERS[i]);
  const stage = stageOf(frame);

  function setAnswer(index: number, value: boolean) {
    setAnswers((current) => current.map((answer, i) => (i === index ? value : answer)));
  }

  function restart() {
    setAnswers([...RAKA_ANSWERS]);
    replay();
  }

  const caption = (() => {
    if (frame === 0) return `Raka, mahasiswa semester dua, memilih Dasar Pemrograman. Ada ${QUESTION_COUNT} skill di dalamnya.`;
    if (frame < LAST_FRAME) {
      const skill = DEMO_SKILLS[frame - 1];
      const result = results[frame - 1];
      return `Soal ${frame} dari ${QUESTION_COUNT}, ${skill.name}. Raka menjawab "${skill.question.chosen}", ${
        result.correct ? "benar" : "salah"
      }. Penguasaan ${skill.name} sekarang ${result.masteryPct}%.`;
    }
    return pathSentence(results);
  })();

  return (
    <section id="cara-kerja" aria-labelledby="demo-title" className={SECTION}>
      <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14`}>
        <div className="lg:pt-2">
          <h2 id="demo-title" className={SECTION_TITLE}>
            Lihat jalur Raka tersusun
          </h2>
          <p className={SECTION_LEAD}>
            Raka sudah bisa sebagian materi. Dari empat jawabannya, kami tahu bagian mana yang boleh ia lewati.
          </p>

          <ol className="mt-8 space-y-2">
            {STAGES.map((item, index) => {
              const active = index === stage;
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    onClick={() => goTo(item.frame)}
                    aria-current={active ? "step" : undefined}
                    className={`flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-colors duration-300 ${
                      active ? "bg-white shadow-[var(--shadow-card)]" : "hover:bg-white/60"
                    }`}
                  >
                    <span
                      className={`font-display grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors duration-300 ${
                        active
                          ? "bg-[var(--color-pink)] text-white"
                          : "bg-[var(--color-line)] text-[var(--color-muted)]"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span>
                      <span className="font-display block text-base font-bold tracking-[-0.01em]!">{item.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-[var(--color-muted)]">{item.body}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div
          ref={panelRef}
          className="rounded-[20px] bg-white p-4 shadow-[0_18px_44px_rgba(23,17,31,0.1)] sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                className="font-display grid size-9 shrink-0 place-items-center rounded-full bg-[var(--color-night)] text-sm font-bold text-[var(--color-cream)]"
              >
                R
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Raka</p>
                <p className="truncate text-xs text-[var(--color-muted)]">Dasar Pemrograman</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "Jeda demo" : finished ? "Putar ulang demo" : "Lanjutkan demo"}
                className="grid size-9 place-items-center rounded-full text-[var(--color-ink)] ring-1 ring-[var(--color-line)] transition-colors hover:bg-[#fff0f5] pointer-coarse:size-11"
              >
                {playing ? <Pause aria-hidden="true" size={16} /> : <Play aria-hidden="true" size={16} />}
              </button>
              <button
                type="button"
                onClick={restart}
                aria-label="Mulai demo dari awal"
                className="grid size-9 place-items-center rounded-full text-[var(--color-ink)] ring-1 ring-[var(--color-line)] transition-colors hover:bg-[#fff0f5] pointer-coarse:size-11"
              >
                <RotateCcw aria-hidden="true" size={16} />
              </button>
            </div>
          </div>

          <p className="mt-4 min-h-[3lh] text-sm leading-relaxed text-[var(--color-ink)] sm:min-h-[2lh]" aria-hidden="true">
            {caption}
          </p>

          {/* Stage: one view per frame; the min height keeps the panel from jumping between frames. */}
          <div className="mt-4 min-h-[19rem]" aria-hidden="true">
            {frame === 0 && <TopicPicked key="topic" />}
            {frame > 0 && frame < LAST_FRAME && <QuestionView key={frame} skill={DEMO_SKILLS[frame - 1]} index={frame} />}
            {finished && (
              <div key="path" className={ENTER}>
                <p className="mb-3 text-xs font-semibold text-[var(--color-muted)]">Jalur belajar</p>
                <SkillPathList path={path} label="Jalur belajar Raka" />
              </div>
            )}
          </div>

          <SkillMeters
            results={results}
            answeredCount={finished ? QUESTION_COUNT : Math.max(0, frame)}
            editable={finished}
            answers={answers}
            onAnswer={setAnswer}
          />

          {finished && (
            <div className={`mt-3 flex flex-wrap items-center justify-between gap-2 ${ENTER}`}>
              <p className="text-sm text-[var(--color-muted)]">Ganti jawaban Raka, lalu lihat jalurnya berubah.</p>
              {edited && (
                <button
                  type="button"
                  onClick={() => setAnswers([...RAKA_ANSWERS])}
                  className="inline-flex min-h-9 items-center rounded-lg text-sm font-semibold text-[var(--color-pink-deep)] underline-offset-4 hover:underline pointer-coarse:min-h-11"
                >
                  Kembalikan jawaban Raka
                </button>
              )}
            </div>
          )}

          {/* Scrubber: every frame is reachable by click or keyboard. */}
          <div className="mt-5 flex items-center justify-center gap-1" role="group" aria-label="Pilih tahap demo">
            {Array.from({ length: DEMO_FRAME_COUNT }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={i === 0 ? "Tahap pilih topik" : i === LAST_FRAME ? "Tahap jalur akhir" : `Soal ${i}`}
                aria-current={i === frame ? "step" : undefined}
                className="group grid h-9 w-9 place-items-center pointer-coarse:h-11 pointer-coarse:w-11"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === frame
                      ? "w-6 bg-[var(--color-pink)]"
                      : i < frame
                        ? "w-1.5 bg-[var(--color-ink)]/40"
                        : "w-1.5 bg-[var(--color-line)] group-hover:bg-[var(--color-muted)]"
                  }`}
                />
              </button>
            ))}
          </div>

          <p className="sr-only" aria-live="polite">
            {finished ? pathSentence(results) : ""}
          </p>
        </div>
      </div>
    </section>
  );
}

function TopicPicked() {
  return (
    <div className={`rounded-2xl bg-[var(--color-cream)] p-5 ${ENTER}`}>
      <p className="text-xs font-semibold text-[var(--color-muted)]">Topik dipilih</p>
      <p className="font-display mt-1 text-xl font-bold tracking-[-0.02em]!">Dasar Pemrograman</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {DEMO_SKILLS.map((skill) => (
          <li key={skill.key} className="rounded-full bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-[var(--color-line)]">
            {skill.name}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
        Belum ada jawaban, jadi semua skill masih ditebak di tengah.
      </p>
    </div>
  );
}

function QuestionView({ skill, index }: { skill: DemoSkill; index: number }) {
  const { question } = skill;
  return (
    <div className={ENTER}>
      <p className="text-xs font-semibold text-[var(--color-muted)]">
        Soal {index} dari {QUESTION_COUNT} · {skill.name}
      </p>
      <p className="font-display mt-1 text-base font-bold tracking-[-0.01em]!">{question.prompt}</p>
      <pre className="mt-3 overflow-x-auto rounded-xl bg-[var(--color-night)] px-4 py-3 font-mono text-sm leading-relaxed text-[#f7e9f1]">
        <code>{question.code}</code>
      </pre>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {question.options.map((option) => {
          const chosen = option === question.chosen;
          const correct = option === question.correct;
          const tone = chosen
            ? correct
              ? "border-[var(--color-mastered)] bg-[var(--color-mastered-tint)] text-[var(--color-mastered-ink)]"
              : "border-[var(--color-weak)] bg-[var(--color-weak-tint)] text-[var(--color-weak-ink)]"
            : correct
              ? "border-dashed border-[var(--color-mastered)] text-[var(--color-mastered-ink)]"
              : "border-[var(--color-line)] text-[var(--color-ink)]";
          return (
            <li key={option} className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 ${tone}`}>
              {chosen && (correct ? <Check aria-hidden="true" size={16} /> : <X aria-hidden="true" size={16} />)}
              <span className="font-mono text-sm">{option}</span>
              {chosen && <span className="ml-auto text-xs font-semibold">Raka</span>}
              {!chosen && correct && <span className="ml-auto text-xs font-semibold">Benar</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SkillMeters({
  results,
  answeredCount,
  editable,
  answers,
  onAnswer,
}: {
  results: SkillResult[];
  answeredCount: number;
  editable: boolean;
  answers: boolean[];
  onAnswer: (index: number, value: boolean) => void;
}) {
  return (
    <div className="mt-5 border-t border-[var(--color-line)] pt-4">
      <p className="text-xs font-semibold text-[var(--color-muted)]">Penguasaan per skill</p>
      <ul className="mt-3 space-y-3">
        {results.map((result, index) => {
          const answered = index < answeredCount;
          return (
            <li
              key={result.key}
              className={`grid grid-cols-[6.5rem_minmax(0,1fr)_2.75rem] items-center gap-x-3 gap-y-2 ${
                editable ? "sm:grid-cols-[6.5rem_minmax(0,1fr)_2.75rem_auto]" : ""
              }`}
            >
              <span className="truncate text-sm font-medium">{result.name}</span>
              <span className="h-2 overflow-hidden rounded-full bg-[var(--color-line)]/70">
                <span
                  className="block h-full rounded-full transition-[width,background-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    width: answered ? `${result.masteryPct}%` : "0%",
                    background: STATUS_COLOR[result.status],
                  }}
                />
              </span>
              <span className="text-right text-sm font-semibold tabular-nums">
                {answered ? `${result.masteryPct}%` : <span className="text-[var(--color-muted)]">–</span>}
              </span>

              {editable && (
                <div
                  role="radiogroup"
                  aria-label={`Jawaban Raka untuk ${result.name}`}
                  className="col-span-3 flex gap-1 sm:col-span-1"
                >
                  <AnswerChoice label="Benar" checked={answers[index]} onSelect={() => onAnswer(index, true)} icon="check" />
                  <AnswerChoice label="Salah" checked={!answers[index]} onSelect={() => onAnswer(index, false)} icon="x" />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AnswerChoice({
  label,
  checked,
  onSelect,
  icon,
}: {
  label: string;
  checked: boolean;
  onSelect: () => void;
  icon: "check" | "x";
}) {
  const Icon = icon === "check" ? Check : X;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={`Raka ${label.toLowerCase()}`}
      onClick={onSelect}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors pointer-coarse:h-11 pointer-coarse:px-4 ${
        checked
          ? icon === "check"
            ? "bg-[var(--color-mastered-tint)] text-[var(--color-mastered-ink)] ring-1 ring-[var(--color-mastered-line)]"
            : "bg-[var(--color-weak-tint)] text-[var(--color-weak-ink)] ring-1 ring-[var(--color-weak-line)]"
          : "text-[var(--color-muted)] ring-1 ring-[var(--color-line)] hover:bg-[var(--color-cream)]"
      }`}
    >
      <Icon aria-hidden="true" size={12} strokeWidth={3} />
      {label}
    </button>
  );
}
