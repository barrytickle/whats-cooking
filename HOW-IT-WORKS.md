# How What's Cooking? Works

Plain **React + TypeScript** (no server, no Next.js) on the free [TheMealDB](https://www.themealdb.com/api.php) API. The goal is learning React fundamentals; the Next.js Pokédex (`~/pokedex`) is waiting for afterwards.

## Stack

| Tool         | Version | Notes                                                                                                                       |
| ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------- |
| Vite         | 8       | Dev server + build. `npm run dev`, `npm run build`                                                                          |
| React        | 19      |                                                                                                                             |
| TypeScript   | 6       | `strict` + `noUncheckedIndexedAccess` on (array access gives `T \| undefined`)                                              |
| Tailwind     | 4       | Via `@tailwindcss/vite`. No `tailwind.config.js`; tokens live in `src/index.css`                                            |
| React Router | **8**   | Declarative mode (see below)                                                                                                |
| Zod          | 4       | Same as the Pokédex: validate API data at the boundary                                                                      |
| oxlint       |         | The linter (`npm run lint`), a fast ESLint alternative                                                                      |
| Prettier     | 3       | Formats on save (`.vscode/settings.json`); `prettier-plugin-tailwindcss` sorts classes. `npm run format` formats everything |

`@/` = `src/`, as in the Pokédex (set in both `vite.config.ts` and `tsconfig.app.json`).

**Types must be imported with `import type`** (this project has `verbatimModuleSyntax` on, so imports are kept exactly as written and only `type` imports are removed during compiling):

```tsx
import type { Meal } from "@/lib/types";
import { getMeals, type Meal } from "@/lib/api"; // mixing a value and a type
```

Shared data types live in `src/lib/types.ts`.

**`type` vs `interface`:** for object shapes they're nearly identical. Differences:

- `type` can also do unions (`"category" | "area"`), template literals, and `z.infer<...>`; `interface` only describes objects.
- Extending: `interface B extends A {}` vs `type B = A & {}`.
- Interfaces with the same name **merge** silently (useful for augmenting library types, surprising otherwise).
- **This project uses `type` everywhere** for consistency.
- Interview answer: _"Nearly identical for objects; `type` also handles unions and computed types; interfaces support `extends` and declaration merging. I use `type` consistently unless I need merging."_

**Type data where you create it:** `const testMeal: Meal = {...}`. Errors then appear on the typo itself, and misspelt _extra_ fields (which pass silently on untyped objects) are caught.

**Can a type say "this string is a URL"?** Only loosely:

- Template literal type: `` strMealThumb: `https://${string}` `` checks strings written in code, but API data is just `string`.
- ✅ **Zod checks the content at runtime:** `strMealThumb: z.url()`, then `type Meal = z.infer<typeof MealSchema>`.
- (Advanced: `z.url().brand<"Url">()` makes "checked URL" a distinct type.)
- Rule: **TypeScript describes the shape; Zod checks the content.**

## Plain React vs Next.js: what's different here

|                 | This project (Vite + React)                         | Pokédex (Next.js)                     |
| --------------- | --------------------------------------------------- | ------------------------------------- |
| Where code runs | **Everything in the browser**                       | Server + browser                      |
| Fetching        | `useEffect` (or TanStack Query later) in components | `await` in Server Components          |
| Loading states  | You build them (`isLoading` state)                  | `loading.tsx` / Suspense              |
| Routing         | **Config**: `<Route path="/meal/:id">`              | **Folders**: `app/meal/[id]/page.tsx` |
| Route params    | `useParams()`                                       | `await params`                        |
| First load      | Empty HTML, then JS builds the page                 | HTML arrives complete                 |

No `"use client"` here, since everything is client code already.

## React Router v8 (declarative mode)

⚠️ Most tutorials show v6/v7. In **v8**:

- Import everything from **`react-router`**. The `react-router-dom` package **no longer exists**.
- Local docs for this exact version: `node_modules/react-router/docs/start/declarative/`.

```tsx
// main.tsx: wrap the app once
import { BrowserRouter } from "react-router";
<BrowserRouter>
  <App />
</BrowserRouter>;

// App.tsx: routes as config
import { Routes, Route } from "react-router";
<Routes>
  <Route path="/" element={<Discover />} />
  <Route path="/category/:name" element={<CategoryPage />} />
  <Route path="/meal/:id" element={<MealPage />} />
  <Route path="/favourites" element={<Favourites />} />
</Routes>;

// In a page: read :id
const { id } = useParams(); // string | undefined
```

Navigation: `<Link to="/favourites">`, not `<a href>` (no full page reload).

**Deploying later:** every URL must serve `index.html` (a "SPA fallback"), or refreshing `/meal/52771` gives a 404. On Vercel, add a rewrite in `vercel.json`.

## Design system (`src/index.css`)

From the mockup, as Tailwind classes:

| Token      | Hex       | Classes                                              |
| ---------- | --------- | ---------------------------------------------------- |
| Deep green | `#1B4332` | `bg-deep-green`, `text-deep-green`                   |
| Tomato red | `#D6453D` | `bg-tomato`, `text-tomato` (primary buttons, hearts) |
| Cream      | `#FDFBF1` | `bg-cream` (page background)                         |
| Sage       | `#A7C957` | `bg-sage`                                            |
| Sand       | `#F1E6D9` | `bg-sand` (tags, secondary surfaces)                 |
| Ink        | `#1F2937` | `text-ink` (body text)                               |

Fonts: `font-display` (Playfair Display, headings) and `font-sans` (Inter, default), loaded in `index.html`.

## TheMealDB: what the API can and can't do

Base URL: `https://www.themealdb.com/api/json/v1/1/` (the `1` is the free test key).

| Endpoint               | Returns                                                                                   |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `search.php?s=pasta`   | Full meals (incl. category + area)                                                        |
| `categories.php`       | 14 categories with photo + description                                                    |
| `filter.php?c=Seafood` | Name + photo + ID + area (**can be `null`**) + country. No category (you know it already) |
| `lookup.php?i=52771`   | One full meal                                                                             |
| `random.php`           | One random full meal                                                                      |

**Quirks (checked against the live API):**

- **No results = `{ "meals": null }`**, not `[]`. `data.meals.map(...)` crashes. Handle it in Zod (e.g. turn `null` into `[]`).
- **Ingredients are 40 fields:** `strIngredient1..20` + `strMeasure1..20`, unused ones `null` or `""`. Transform them into `[{ ingredient, measure }]`.
- **Instructions are one string with `\r\n` line breaks.** Split into numbered steps.
- `strYoutube` / `strSource` are **often empty**, so show those buttons only when present.
- `filter.php` takes **one** filter. Extra params are silently ignored (`?c=Seafood&a=Japanese` returns all 84 seafood meals).
- Doesn't exist: popularity, ratings, cook times, servings, short descriptions, multiple photos, accounts.

## Props: the #1 React gotcha

A component receives **one argument: the props object**. `<Tag name="Pasta" variant="area" />` calls `Tag({ name: "Pasta", variant: "area" })`.

```tsx
type TagProps = { name: string; variant: "category" | "area" };

export function Tag({ name, variant }: TagProps) { ... }   // ✅ destructure one object
export function Tag(name: string, variant: string) { ... } // ❌ "Expected 2 arguments, got 1"
```

- **Union types enforce the design system:** `variant: "category" | "area"` means `variant="blue"` gets a red squiggle.
- **Map variants to full class names.** Don't build them with strings (`` `bg-${colour}` ``): Tailwind only generates classes it can see written out in full.
  ```tsx
  const variantClasses = {
    category: "bg-tomato/15 text-tomato",
    area: "bg-sage/25 text-deep-green",
  };
  ```
- `bg-tomato/15` = the brand colour at 15% opacity.

**Pass objects, not every field.** Give the card one `meal` prop instead of `name`, `image`, `category`...:

```tsx
export type Meal = { idMeal: string; strMeal: string; strMealThumb: string; strCategory: string; strArea: string };

type MealCardProps = { meal: Meal; isFavourite: boolean; onToggleFavourite: () => void };

<MealCard meal={testMeal} isFavourite={false} onToggleFavourite={...} />
```

- `Meal` = the **data** (shared: cards, detail, favourites, API code). `MealCardProps` = **this component's inputs** (grows over time).
- Later, `type Meal = z.infer<typeof MealSchema>` so the schema writes the type.
- `<MealCard {...meal} />` (spreading) works, but one `meal` prop is clearer.

**Components don't handle "no data"; the parent decides whether to render them.**

- `meal: Meal` already promises a real meal, so a `meal === null` check inside can never run.
- Parent: `{meal && <MealCard meal={meal} />}`, or `meals.length === 0 ? <EmptyState /> : meals.map(...)`.
- API `meals: null` → `[]` happens even earlier, at the boundary (Zod).
- **Props are read-only.** Never reassign them (`meal = ...`).
- Keep test data in the **parent**, not inside the component (or it hides bugs).
- Default values are for **optional settings**: `function Card({ size = "md" }: { size?: "sm" | "md" })`.
- `className="flex gap-2"`: braces and backticks are only needed when there's a variable inside.

**Card HTML checklist:**

- Outer element `<article>` (self-contained content); grids are `<ul>` + `<li>`.
- `<img alt="..." loading="lazy">` inside an aspect-ratio wrapper (`relative aspect-video overflow-hidden`).
- `line-clamp-2` on titles so long names don't make uneven cards.
- **Never nest interactive elements** (button inside a link, or button inside a button): it's invalid HTML. For a clickable card with a ♡, use the **stretched link** pattern: the title is the link, `after:absolute after:inset-0` stretches its click area over the card, and the ♡ gets `relative z-10` to sit above it.

**Overlaying things (the ♡ on a photo):** give the wrapper `relative` and the overlay `absolute top-2 right-2`. `absolute` positions against the nearest `relative` ancestor.

**Sizing comes from the parent, too:** like margins, a card's _width_ should come from the grid column, not a `max-w-[...]` on the card.

**Inline elements (`<span>`, `<a>`) ignore some sizing.** Vertical padding overlaps neighbouring lines instead of pushing them away, and `leading-*` doesn't change the line's height. For pills and badges use **`inline-flex items-center`** (or `inline-block`).

**Fixed height + vertical padding fight.** Tailwind uses `box-sizing: border-box`, so `h-*` **includes** the padding. `h-7` (28px) + `py-5` (40px of padding) leaves no room for the text, so it spills out. Pick one: padding decides the height (`px-3 py-1`), _or_ a fixed height with `items-center` and no `py-*`.

**Components don't set their own outer margins.** Let the parent space them: `<div className="flex gap-2">` around the tags, not `mx-1` on each tag.

## Component plan ("Thinking in React")

| Component         | Props (roughly)                                       | Notes                                                            |
| ----------------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| `Navigation`      | current page                                          |                                                                  |
| `Hero`            | `children`                                            | Put the SearchBar _inside_ via children (composition)            |
| `SearchBar`       | `value`, `onChange`                                   | Controlled; reusable on any page                                 |
| `CategoryCard`    | `category`, `onClick`                                 | Separate from MealCard: different data (and circle on mobile)    |
| `MealCard`        | `meal`, `isFavourite`, `onToggleFavourite`, `onClick` | **Told** whether it's a favourite; doesn't own it                |
| `Tag`             | `children`, variant (category/area)                   | Pills on cards and detail                                        |
| `FavouriteButton` | `isFavourite`, `onToggle`                             | Used on cards _and_ the detail page                              |
| `CardGrid`        | `title?`, `children`                                  | Generic: holds any cards. Doesn't sort                           |
| `ResultsToolbar`  | `count`, `sort`, `onSortChange`                       | "12 meals found" + SortSelect                                    |
| `FeelingLucky`    | `onClick`                                             | Placed by the page next to the category grid                     |
| `MealDetail`      | `meal`                                                | Its own routed page (`/meal/:id`), based on `design/recipe.webp` |
| `IngredientList`  | `ingredients`                                         | Owns its own "ticked" state (nothing else needs it)              |
| `Instructions`    | `steps`                                               | Numbered list                                                    |
| `EmptyState`      | `title`, `message`, `action?`                         | Reused for "no results" _and_ "no favourites"                    |
| `ErrorState`      | `onRetry`                                             | "Couldn't load recipes"                                          |
| `SkeletonGrid`    | `count?`                                              | Loading state                                                    |

**Folder structure.** The key question is "does it know about meals?":

```
src/
├── components/
│   ├── ui/           ← generic building blocks: Tag, Button, CardGrid, EmptyState, SearchBar, FavouriteButton
│   ├── meals/        ← know about meals: MealCard, MealDetail, IngredientList, Instructions
│   ├── categories/   ← CategoryCard
│   └── layout/       ← Navigation, Hero
├── pages/            ← one per route
├── lib/              ← API calls + Zod schemas
└── App.tsx           ← routes
```

- `ui/` is your design system in code (what designers call patterns or primitives).
- Dependencies flow one way: **pages → meals/categories → ui**. `ui/` never imports from `meals/`.
- Don't over-plan; move files as the app grows (`@/` imports make it painless).

**Design rules learned:**

- **Don't let a card own shared state.** The same favourite shows in several places, so it lives higher up (App → Zustand later) and is passed down.
- **Composition over boolean props.** `showFeelingLucky={true}` turns into `if`-soup; let the parent place `<FeelingLucky />` next to the grid.
- **Generic containers take `children`.** `CardGrid` doesn't know about meals, so it can hold category cards too.
- **Sorting belongs to whoever owns the data** (the page), not the grid.
- **Only lift state when something else needs it.** Ticked ingredients stay local.

**Where state lives:**

| State                                | Lives in                                       |
| ------------------------------------ | ---------------------------------------------- |
| Search text, selected category, sort | The page that uses it (category is in the URL) |
| Favourites                           | `App` → Zustand                                |
| Ticked ingredients                   | `IngredientList`                               |
| Open meal                            | URL (`/meal/:id`) once Router is in            |

## Build plan

**Version 1 (core):**

1. Category grid: fetch `categories.php` with `useEffect`; loading + error states
2. Homepage "Something to try": several `random.php` calls with `Promise.all`
3. React Router: `/`, `/category/:name`, `/meal/:id`
4. Category page: `filter.php?c=…` → meals grid (layout from `design/search.webp`)
5. Search box → **lifting state up** (SearchBox + MealGrid as siblings) and the `meals: null` case; results reuse the category page layout
6. Meal detail page (`design/recipe.webp`): ingredients transform, checkboxes, numbered steps, conditional video button
7. "Feeling lucky?" → `random.php`

**Version 2:** `/favourites` page → favourites in localStorage → sort A–Z

**Version 3 (stretch):** Zustand for favourites → TanStack Query for fetching → deploy to Vercel
