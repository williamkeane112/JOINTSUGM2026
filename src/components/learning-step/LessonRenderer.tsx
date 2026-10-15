import { useState } from "react";
import { CheckCircle2, CircleHelp, Code2, Lightbulb, ListChecks } from "lucide-react";
import type { GeneratedLesson } from "../../lib/learning-step/types";

interface Props {
  lesson: GeneratedLesson;
  onComplete: () => void;
  completing?: boolean;
}

export default function LessonRenderer({ lesson, onComplete, completing = false }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const correctCount = lesson.quiz.filter((q, i) => answers[i] === q.correct_answer).length;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#eee8f8] bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f0eaff] text-[#7956c8]">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8b7aa9]">Materi dari AI</p>
            <h2 className="mt-1 text-xl font-extrabold text-[#302744] sm:text-2xl">{lesson.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#625b71]">{lesson.summary}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-[#fcfaff] p-4">
          <h3 className="font-bold text-[#342a4b]">Target pembelajaran</h3>
          <ul className="mt-3 space-y-2">
            {lesson.learning_objectives.map((objective, i) => (
              <li key={`${i}-${objective}`} className="flex items-start gap-2 text-sm leading-6 text-[#625b71]">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                {objective}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {lesson.sections.map((section, index) => (
        <article key={`${index}-${section.title}`} className="rounded-2xl border border-[#eee8f8] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-3 border-b border-[#f0ebf6] pb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0eaff] text-[#7956c8]">
              {index === 0 ? <Lightbulb className="h-5 w-5" /> : <Code2 className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#8b7aa9]">Bagian {index + 1}</p>
              <h3 className="mt-1 text-lg font-extrabold text-[#302744]">{section.title}</h3>
            </div>
          </div>
          <div className="space-y-4 py-5 text-sm leading-7 text-[#625b71] sm:text-[15px]">
            {section.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {section.example && (
            <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-violet-700">Contoh</p>
              <p className="whitespace-pre-wrap text-sm leading-6 text-violet-950">{section.example}</p>
            </div>
          )}
          {section.bullets && section.bullets.length > 0 && (
            <ul className="mt-4 space-y-2">
              {section.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-6 text-[#625b71]">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{bullet}
                </li>
              ))}
            </ul>
          )}
        </article>
      ))}

      <section className="rounded-2xl border border-[#eee8f8] bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ListChecks className="h-5 w-5" /></div>
          <div>
            <h3 className="text-lg font-extrabold text-[#302744]">{lesson.practice.title}</h3>
            <p className="mt-1 text-sm text-[#898197]">Latihan praktik</p>
          </div>
        </div>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-[#625b71]">
          {lesson.practice.instructions.map((instruction, i) => <li key={i}>{instruction}</li>)}
        </ol>
        <div className="mt-4 rounded-xl bg-emerald-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">Hasil yang diharapkan</p>
          <p className="mt-1 text-sm leading-6 text-emerald-900">{lesson.practice.expected_result}</p>
        </div>
        {lesson.safety_note && <p className="mt-4 text-xs leading-5 text-amber-800">Catatan: {lesson.safety_note}</p>}
      </section>

      {lesson.quiz.length > 0 && (
        <section className="rounded-2xl border border-[#eee8f8] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0eaff] text-[#7956c8]"><CircleHelp className="h-5 w-5" /></div>
            <div><h3 className="text-lg font-extrabold text-[#302744]">Evaluasi singkat</h3><p className="text-sm text-[#898197]">Uji pemahaman materi ini.</p></div>
          </div>
          <div className="mt-5 space-y-6">
            {lesson.quiz.map((q, i) => (
              <div key={`${i}-${q.question}`}>
                <p className="font-semibold leading-6 text-[#342a4b]">{i + 1}. {q.question}</p>
                <div className="mt-3 grid gap-2">
                  {q.options.map((option) => {
                    const selected = answers[i] === option.id;
                    const isCorrect = showResults && q.correct_answer === option.id;
                    const isWrong = showResults && selected && !isCorrect;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={showResults}
                        onClick={() => setAnswers((current) => ({ ...current, [i]: option.id }))}
                        className={`rounded-xl border p-3 text-left text-sm transition ${
                          isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-900" :
                          isWrong ? "border-red-300 bg-red-50 text-red-900" :
                          selected ? "border-violet-300 bg-violet-50 text-violet-900" :
                          "border-[#eee8f6] hover:border-violet-200 hover:bg-[#fcfaff]"
                        }`}
                      >
                        <span className="mr-2 font-bold">{option.id}.</span>{option.text}
                      </button>
                    );
                  })}
                </div>
                {showResults && <p className="mt-2 text-sm leading-6 text-[#756b87]">{q.explanation}</p>}
              </div>
            ))}
          </div>
          {!showResults ? (
            <button type="button" disabled={Object.keys(answers).length !== lesson.quiz.length} onClick={() => setShowResults(true)} className="mt-6 rounded-xl bg-[#7653c5] px-5 py-3 text-sm font-bold text-white hover:bg-[#6542b4] disabled:cursor-not-allowed disabled:opacity-50">
              Periksa jawaban
            </button>
          ) : (
            <div className="mt-5 rounded-xl bg-[#f7f4fd] p-4">
              <p className="font-bold text-[#342a4b]">Skor: {correctCount}/{lesson.quiz.length}</p>
              <p className="mt-1 text-sm text-[#756b87]">Pastikan kamu memahami pembahasan sebelum menandai tahap selesai.</p>
            </div>
          )}
        </section>
      )}

      <button type="button" disabled={completing || !showResults && lesson.quiz.length > 0} onClick={onComplete} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">
        <CheckCircle2 className="h-4 w-4" />{completing ? "Menyimpan progres..." : "Tandai tahap selesai"}
      </button>
    </div>
  );
}
