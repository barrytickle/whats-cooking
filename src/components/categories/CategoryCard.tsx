import type { Category } from "@/lib/types";

type CategoryCardProps = {
  category: Category;
  onClick: () => void;
};

const categoryCardStyles = {
  card: "flex flex-col gap-2 rounded-xl bg-white p-4 shadow-md",
  image: "aspect-square w-full",
  labelContainer: "flex flex-col items-center justify-center",
  label: "h-5 font-semibold",
};

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`${categoryCardStyles.card} cursor-pointer hover:bg-gray-100`}
    >
      <div className={categoryCardStyles.image}>
        <img src={category.strCategoryThumb} alt="" />
      </div>
      <div className={categoryCardStyles.labelContainer}>
        <span className={categoryCardStyles.label}>{category.strCategory}</span>
      </div>
    </button>
  );
}

export function CategoryCardPlaceholder() {
  return (
    <div className={`${categoryCardStyles.card} animate-pulse`}>
      <div className={categoryCardStyles.image}>
        <div className="aspect-square w-full rounded-lg bg-gray-100"></div>
      </div>
      <div className={categoryCardStyles.labelContainer}>
        <div className={`${categoryCardStyles.label} w-full rounded bg-gray-100`}></div>
      </div>
    </div>
  );
}
