import { Tag } from "@/components/ui/Tag";
import type { Meal } from "@/lib/types";
import { FavouriteButton } from "@/components/ui/FavouriteButton";

type MealCardProps = {
  meal: Meal;
  isFavourite: boolean;
  onToggleFavourite: () => void;
};

export function MealCard({ meal, isFavourite, onToggleFavourite }: MealCardProps) {
  return (
    <article className={`overflow-hidden rounded-2xl bg-white shadow-md`} title={meal.strMeal}>
      <div className={`relative aspect-video`}>
        <img
          className="block size-full rounded-br-2xl rounded-bl-2xl object-cover"
          src={meal.strMealThumb}
          alt={meal.strMeal}
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <FavouriteButton isFavourite={isFavourite} onToggle={onToggleFavourite} />
        </div>
      </div>
      <div className="px-3 py-3">
        <h3 className="mb-2 line-clamp-2 font-bold">{meal.strMeal}</h3>
        <div className="flex gap-2">
          <Tag name={meal.strCategory} variant="category" />
          <Tag name={meal.strArea} variant="area" />
        </div>
      </div>
    </article>
  );
}
