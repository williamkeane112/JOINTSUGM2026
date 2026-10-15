
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
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9F0] px-4 py-10">
        <div className="w-full max-w-md rounded-[2rem] border border-[#EAE2F0] bg-white p-8 text-center shadow-[0_16px_50px_rgba(48,33,63,0.07)]">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0F5] text-3xl font-bold text-[#F43F91]">
            !
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7560B5]">
            SkillPath AI
          </p>

          <h1 className="mt-3 text-xl font-bold text-[#30213F]">
            Gagal memuat diagnostic
          </h1>

          <p className="mt-3 break-words text-sm leading-6 text-[#81778D]">
            {error}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-6 w-full rounded-xl bg-[#7560B5] px-5 py-3 font-semibold text-white transition hover:bg-[#62509D] focus:outline-none focus:ring-4 focus:ring-[#7560B5]/20"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF9F0] px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-[#EAE2F0] bg-white p-8 text-center shadow-[0_16px_50px_rgba(48,33,63,0.07)]">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0EAFB]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E6DDF8] border-t-[#7560B5]" />
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7560B5]">
          SkillPath AI
        </p>

        <h1 className="mt-3 text-xl font-bold text-[#30213F]">
          Menyiapkan tes kemampuanmu
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#81778D]">
          {message}
        </p>

        <div className="mt-7 h-2 overflow-hidden rounded-full bg-[#EEE8F3]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-[#7560B5] to-[#F43F91]" />
        </div>

        <p className="mt-4 text-xs text-[#A198AA]">
          Mohon tunggu sebentar, ya.
        </p>
      </div>
    </main>
  );
}
