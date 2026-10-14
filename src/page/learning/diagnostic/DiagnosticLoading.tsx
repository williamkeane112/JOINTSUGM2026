
type Props = {
  message?: string;
  error?: string | null;
  onRetry?: () => void;
};

export default function DiagnosticLoading({
  message = "AI sedang menyiapkan soal untukmu...",
  error,
  onRetry,
}: Props) {
  if (error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
            !
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            Gagal memuat diagnostic
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {error}
          </p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-6 w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
        </div>

        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
          SkillPath AI
        </p>

        <h1 className="mt-3 text-xl font-bold text-slate-900">
          Menyiapkan tes kemampuanmu
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {message}
        </p>

        <div className="mt-7 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-500" />
        </div>
      </div>
    </main>
  );
}
