import { useState } from "react";
import { MealCard } from "@/components/meal/MealCard";
import type { Meal, Category } from "@/lib/types";
import { CategoryCard, CategoryCardPlaceholder } from "@/components/categories/CategoryCard";
import { CardGrid } from "@/components/ui/CardGrid";
import { useEffect } from "react";
import { getCategories } from "./lib/get";
import { ErrorMessage } from "./components/ui/ErrorMessage";
const testMeal: Meal = {
  idMeal: "52771",
  strMeal: "Spicy Arrabiata Penne",
  strMealThumb: "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
  strCategory: "Pasta",
  strArea: "Italian",
};

// Placeholder to prove Tailwind + the design system work. Replace with your own app!
function App() {
  const [favourite, setFavourite] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryStatus, setCategoryStatus] = useState<"loading" | "success" | "error">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    async function loadCategories(): Promise<void> {
      setCategoryStatus("loading");
      const categoriesList = await getCategories();
      if (categoriesList.status === "error") {
        setCategoryStatus("error");
        return;
      }
      const { data } = categoriesList;
      setCategories(data);
      setCategoryStatus("success");
    }

    loadCategories();
    // [] is a list of dependencies that useEffect looks at to render, if therre's no dependencies it'll just finish on one.
  }, [attempt]);

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="font-display text-4xl font-bold text-deep-green">What's Cooking?</h1>
      <p className="mt-2">Setup works. Time to build!</p>
      <button className="mt-4 rounded-full bg-tomato px-5 py-2 font-medium text-white">
        Get random recipe
      </button>

      {categoryStatus === "error" && <ErrorMessage onRetry={() => setAttempt(attempt + 1)} />}

      {categoryStatus !== "error" && (
        <CardGrid title="Categories" layout="categories" className="mb-3">
          {categoryStatus === "success" &&
            categories.map((category) => (
              <CategoryCard
                key={category.idCategory}
                category={category}
                onClick={() => {
                  return;
                }}
              />
            ))}
          {categoryStatus === "loading" &&
            Array.from({ length: 8 }).map((_, i) => <CategoryCardPlaceholder key={i} />)}
        </CardGrid>
      )}
      <CardGrid title="Recipes">
        {Array.from({ length: 8 }).map((_, i) => (
          <MealCard
            key={i}
            meal={testMeal}
            isFavourite={favourite}
            onToggleFavourite={() => setFavourite(!favourite)}
          />
        ))}
      </CardGrid>
    </main>
  );
}

export default App;
