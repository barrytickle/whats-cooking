import type { Category } from "@/lib/types";

type CategoriesResult =
  { status: "success"; data: Category[] } | { status: "error"; message: string };

export async function getCategories(): Promise<CategoriesResult> {
  const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  if (response.status !== 200) {
    return {
      status: "error",
      message: "Response failed",
    };
  }

  const data = await response.json();
  return {
    status: "success",
    data: data.categories,
  };
}
