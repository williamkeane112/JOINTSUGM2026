
const PAGE_SIZE = 9;

export default function TopicGridSkeleton() {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Memuat topik"
      aria-busy="true"
    >
      {Array.from({ length: PAGE_SIZE }, (_, index) => (
        <div
          key={index}
          className="min-h-[245px] animate-pulse rounded-2xl border border-[#EAE2F0] bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <div className="h-11 w-11 rounded-2xl bg-[#F1EBFF]" />
            <div className="h-6 w-24 rounded-full bg-[#F0E9F2]" />
          </div>

          <div className="mt-5 h-3 w-20 rounded bg-[#EAE2F0]" />
          <div className="mt-3 h-5 w-3/4 rounded bg-[#EAE2F0]" />
          <div className="mt-3 h-3 w-full rounded bg-[#F0E9F2]" />
          <div className="mt-2 h-3 w-5/6 rounded bg-[#F0E9F2]" />
          <div className="mt-6 h-10 rounded-xl bg-[#EAE2F0]" />
        </div>
      ))}
    </div>
  );
}
