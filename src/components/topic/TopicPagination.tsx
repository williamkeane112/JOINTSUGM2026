
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const inactiveClass =
    "inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#EAE2F0] bg-white px-3.5 py-2.5 text-sm font-medium text-[#7560B5] transition hover:border-[#CFC3E9] hover:bg-[#F8F4FF] disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label="Pagination katalog topik"
      className="mt-7 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={inactiveClass}
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Sebelumnya</span>
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onChange(page)}
            disabled={loading || isActive}
            aria-current={isActive ? "page" : undefined}
            className={`min-w-10 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${
              isActive
                ? "border-[#7560B5] bg-[#7560B5] text-white shadow-sm"
                : "border-[#EAE2F0] bg-white text-[#7560B5] hover:border-[#CFC3E9] hover:bg-[#F8F4FF]"
            } disabled:cursor-default`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
        className={inactiveClass}
      >
        <span className="hidden sm:inline">Berikutnya</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
