
import { useNavigate } from "react-router-dom";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function TopicSearchBar({ value, onChange }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Cari React, Python, Machine Learning..."
        aria-label="Cari topik belajar"
        className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
      />

      <button
        type="button"
        onClick={() => navigate("/topic/request")}
        className="shrink-0 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
      >
        + Ajukan Topik Baru
      </button>
    </div>
  );
}
