import { useState } from "react";
import { MealCard } from "@/components/meal/MealCard";
import type { Meal, Category } from "@/lib/types";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { CardGrid } from "@/components/ui/CardGrid";
import { useEffect } from "react";
import { getCategories } from "./lib/get";
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

  useEffect(() => {
    (async () => {
      const categoriesList = await getCategories();
      if (categoriesList.status === "error") {
        console.log("Unable to parse categories in App");
        return;
      }
      const { data } = categoriesList;
      setCategories(data);
    })();
    // [] is a list of dependencies that useEffect looks at to render, if therre's no dependencies it'll just finish on one.
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="font-display text-4xl font-bold text-deep-green">What's Cooking?</h1>
      <p className="mt-2">Setup works. Time to build!</p>
      <button className="mt-4 rounded-full bg-tomato px-5 py-2 font-medium text-white">
        Get random recipe
      </button>

      <CardGrid title="Categories" layout="categories" className="mb-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.idCategory}
            category={category}
            onClick={() => {
              return;
            }}
          />
        ))}
      </CardGrid>
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
