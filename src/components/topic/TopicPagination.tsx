
type Props = {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onChange: (page: number) => void;
};

export default function TopicPagination({
  currentPage,
  totalPages,
  loading,
  onChange,
}: Props) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  const pages = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  );

  const buttonClass =
    "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label="Pagination katalog topik"
      className="mt-5 flex flex-wrap items-center justify-center gap-1.5"
    >
      <button
        type="button"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={buttonClass}
      >
        Sebelumnya
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onChange(page)}
          disabled={loading || page === currentPage}
          aria-current={page === currentPage ? "page" : undefined}
          className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-medium transition ${
            page === currentPage
              ? "border-violet-600 bg-violet-600 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
          } disabled:cursor-default`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
        className={buttonClass}
      >
        Berikutnya
      </button>
    </nav>
  );
}
