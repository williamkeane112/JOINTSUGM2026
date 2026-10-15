
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Lightbulb,
  ListChecks,
  Target,
} from "lucide-react";
import type { LessonSection } from "./types";

interface Props {
  section: LessonSection;
  activeSection: number;
  totalSections: number;
  completed: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function LessonContentCard({
  section,
  activeSection,
  totalSections,
  completed,
  onPrevious,
  onNext,
}: Props) {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  function toggleChecklist(index: number) {
    setCheckedItems((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  }

  // Lindungi komponen dari struktur materi AI yang tidak lengkap.
  const paragraphs = Array.isArray(section?.paragraphs)
    ? section.paragraphs.filter(
        (paragraph): paragraph is string =>
          typeof paragraph === "string" && paragraph.trim().length > 0,
      )
    : [];

  const bullets = Array.isArray(section?.bullets)
    ? section.bullets.filter(
        (bullet): bullet is string =>
          typeof bullet === "string" && bullet.trim().length > 0,
      )
    : [];

  const sectionTitle =
    typeof section?.title === "string" && section.title.trim()
      ? section.title
      : `Bagian ${activeSection + 1}`;

  const SectionIcon =
    activeSection === 0
      ? Lightbulb
      : activeSection === 1
        ? Code2
        : ListChecks;

  return (
    <article className="rounded-2xl border border-[#eee8f8] bg-white p-5 shadow-[0_5px_24px_-18px_rgba(51,36,83,0.3)] sm:p-7">
      <div className="flex items-start gap-3 border-b border-[#f0ebf6] pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f0eaff] text-[#7956c8]">
          <SectionIcon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8b7aa9]">
            Bagian {activeSection + 1}
          </p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[#302744] sm:text-2xl">
            {sectionTitle}
          </h2>
        </div>
      </div>

      <div className="space-y-4 py-5 text-sm leading-7 text-[#625b71] sm:text-[15px]">
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))
        ) : (
          <p className="text-[#898197]">
            Penjelasan untuk bagian ini belum tersedia.
          </p>
        )}
      </div>

      {bullets.length > 0 && (
        <div className="rounded-2xl border border-[#e9e1f7] bg-[#fcfaff] p-4 sm:p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#342a4b]">
            <Target className="h-4 w-4 text-[#7956c8]" />
            Poin penting
          </h3>

          <ul className="mt-3 space-y-3">
            {bullets.map((bullet, index) => (
              <li
                key={`${index}-${bullet}`}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span className="text-sm leading-6 text-[#625b71]">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {typeof section?.example === "string" &&
        section.example.trim().length > 0 && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-amber-900">
              <Lightbulb className="h-4 w-4" />
              Contoh
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-amber-950">
              {section.example}
            </p>
          </div>
        )}

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-[#342a4b]">
            Checklist pemahaman
          </h3>
          <span className="text-xs font-semibold text-[#8b819d]">
            {checkedItems.length}/3
          </span>
        </div>

        <p className="mt-1 text-sm leading-6 text-[#898197]">
          Tandai setelah kamu memahami poin-poin di atas.
        </p>

        <div className="mt-3 space-y-2">
          {[
            "Saya memahami tujuan bagian ini.",
            "Saya dapat menjelaskan poin penting dengan kata-kata sendiri.",
            "Saya siap melanjutkan ke bagian berikutnya.",
          ].map((item, index) => {
            const checked = checkedItems.includes(index);

            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleChecklist(index)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                  checked
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-[#eee8f6] bg-white hover:border-[#d8c9f4] hover:bg-[#fcfaff]"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    checked
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-[#d8d0e5] bg-white text-transparent"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>

                <span
                  className={`text-sm leading-6 ${
                    checked ? "text-emerald-800" : "text-[#625b71]"
                  }`}
                >
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex flex-col-reverse justify-between gap-3 border-t border-[#f0ebf6] pt-5 sm:flex-row sm:items-center">
        <button
          type="button"
          disabled={activeSection === 0}
          onClick={onPrevious}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e7e0f0] bg-white px-4 py-3 text-sm font-semibold text-[#625b71] transition hover:bg-[#f8f5fc] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Bagian sebelumnya
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={completed}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7653c5] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6542b4] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {activeSection < totalSections - 1
            ? "Bagian berikutnya"
            : "Tandai tahap selesai"}

          {activeSection < totalSections - 1 ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </article>
  );
}
