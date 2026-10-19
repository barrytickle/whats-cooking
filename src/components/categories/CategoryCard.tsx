import type { Category } from "@/lib/types";

type CategoryCardProps = {
  category: Category;
  onClick: () => void;
};

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex cursor-pointer flex-col gap-2 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-md hover:bg-gray-100"
    >
      <div className="overflow-hidden rounded-2xl">
        <img src={category.strCategoryThumb} alt="" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="font-semibold">{category.strCategory}</span>
      </div>
    </button>
  );
}
