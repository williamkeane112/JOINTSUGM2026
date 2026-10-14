
import type { Category } from "../../hooks/useExploreTopics";

type Props = {
  categories: Category[];
  selectedCategory: string;
  onChange: (categoryId: string) => void;
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onChange,
}: Props) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onChange("all")}
        aria-pressed={selectedCategory === "all"}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
          selectedCategory === "all"
            ? "bg-violet-600 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        Semua
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(String(category.id))}
          aria-pressed={selectedCategory === String(category.id)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
            selectedCategory === String(category.id)
              ? "bg-violet-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
