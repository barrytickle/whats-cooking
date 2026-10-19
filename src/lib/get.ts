import type { Category } from "@/lib/types";

type CategoriesResult =
  { status: "success"; data: Category[] } | { status: "error"; message: string };

export async function getCategories(): Promise<CategoriesResult> {
  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    if (!response.ok) {
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
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error retrieving categories " + message);
    return {
      status: "error",
      message: "error retrieving categories: " + message,
    };
  }
}
