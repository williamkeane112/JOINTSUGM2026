
const PAGE_SIZE = 9;

export default function TopicGridSkeleton() {
  return (
    <div
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Memuat topik"
      aria-busy="true"
    >
      {Array.from({ length: PAGE_SIZE }, (_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="h-3 w-24 rounded bg-slate-200" />
          <div className="mt-3 h-5 w-3/4 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
          <div className="mt-5 h-9 rounded-lg bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
