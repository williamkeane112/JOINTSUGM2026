
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function TopicSearchBar({ value, onChange }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#EAE2F0] bg-[#FFFCFA] px-4 transition focus-within:border-[#7560B5] focus-within:ring-4 focus-within:ring-[#7560B5]/10">
        <Search size={19} className="shrink-0 text-[#93879F]" />

        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Cari React, Python, Machine Learning..."
          aria-label="Cari topik belajar"
          className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#29243B] outline-none placeholder:text-[#B2A7B9]"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Hapus pencarian"
            className="rounded-lg px-2 py-1 text-xs font-semibold text-[#7560B5] hover:bg-[#F1EBFF]"
          >
            Hapus
          </button>
        )}
      </label>

      <button
        type="button"
        onClick={() => navigate("/topic/request")}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#7560B5] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#62509B] active:scale-[0.98]"
      >
        <Plus size={17} />
        Ajukan Topik Baru
        <ArrowRight size={15} className="ml-1 opacity-70" />
      </button>
    </div>
  );
}
