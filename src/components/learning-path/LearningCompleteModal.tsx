
import { CheckCircle2, Trophy, X } from "lucide-react";

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  statusLabel?: string;
  onClose: () => void;
}

export default function LearningCompleteModal({
  open,
  title = "Selamat, kamu berhasil!",
  description = "Semua tahap pembelajaran telah kamu selesaikan. Terus berlatih dan gunakan kemampuan baru yang sudah kamu pelajari.",
  statusLabel = "Learning path selesai",
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="learning-complete-title"
        className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="ml-auto flex rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <Trophy className="h-9 w-9" />
        </div>

        <h2
          id="learning-complete-title"
          className="mt-5 text-2xl font-bold text-gray-900"
        >
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          {description}
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
          {statusLabel}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Kembali ke learning path
        </button>
      </section>
    </div>
  );
}
