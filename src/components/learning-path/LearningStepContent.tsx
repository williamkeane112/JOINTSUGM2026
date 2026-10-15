
import { BookOpen, Clock3 } from "lucide-react";
import type { LearningPathStep } from "../../types/learning-path";
import LearningObjectives from "./LearningObjectives";

interface Props {
  step: LearningPathStep;
}

export default function LearningStepContent({ step }: Props) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <BookOpen className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Tahap {step.order_sequence}
          </p>
          <h1 className="text-xl font-bold text-gray-900">
            {step.title}
          </h1>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
        <Clock3 className="h-4 w-4" />
        Estimasi {step.estimated_minutes} menit
      </div>

      {step.description && (
        <div className="mt-6">
          <h2 className="font-semibold text-gray-900">Ringkasan materi</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
            {step.description}
          </p>
        </div>
      )}

      <LearningObjectives objectives={step.learning_objectives ?? []} />

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm leading-6 text-amber-900">
          Bagian ini menampilkan deskripsi tahap yang tersimpan di database.
          Konten pembelajaran lengkap, contoh kode, latihan, dan evaluasi
          perlu diambil atau dibuat melalui layanan materi pembelajaran.
        </p>
      </div>
    </article>
  );
}
