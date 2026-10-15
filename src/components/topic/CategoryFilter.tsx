
import { SlidersHorizontal } from "lucide-react";
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
    <div>
      <div className="mb-3 flex items-center gap-2">
        <SlidersHorizontal size={15} className="text-[#7560B5]" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#93879F]">
          Filter kategori
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange("all")}
          aria-pressed={selectedCategory === "all"}
          className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
            selectedCategory === "all"
              ? "border-[#7560B5] bg-[#7560B5] text-white shadow-sm"
              : "border-[#EAE2F0] bg-white text-[#7560B5] hover:border-[#BDB0E0] hover:bg-[#F8F4FF]"
          }`}
        >
          Semua Topik
        </button>

        {categories.map((category) => {
          const isActive = selectedCategory === String(category.id);

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(String(category.id))}
              aria-pressed={isActive}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                isActive
                  ? "border-[#7560B5] bg-[#7560B5] text-white shadow-sm"
                  : "border-[#EAE2F0] bg-white text-[#7560B5] hover:border-[#BDB0E0] hover:bg-[#F8F4FF]"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
