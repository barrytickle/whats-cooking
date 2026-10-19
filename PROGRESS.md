# Progress Log

Where we're up to, so the next session can pick straight up. (Concepts and explanations live in `HOW-IT-WORKS.md`.)

## ▶️ Next up

**"Something to try": random meals on the homepage**

- Replace the 8 `testMeal` cards with ~8 real random meals from `random.php` (each call returns **one** meal, in `data.meals[0]`)
- New idea: **`Promise.all`**, which runs several fetches at once and waits for all of them. Filter out duplicates by `idMeal`
- Add a `getRandomMeals()` next to `getCategories()` in `get.ts`, with the same success/error result shape
- Reuse what you just built: a status (`"loading" | "success" | "error"`), placeholder cards (a `MealCardPlaceholder` beside `MealCard`), `ErrorMessage` + retry
- Then fix the "every heart toggles together" bug, since the meals will have real, different IDs

**Decided for the homepage and category pages**

- Homepage shows **"Something to try"**: ~8 random meals from `random.php` (one meal per call), fetched together with `Promise.all`. Filter out duplicates. (`latest.php` is premium-only, so no "Latest recipes")
- Clicking a category **navigates** to `/category/:name`: a results page (layout from `design/search.webp`), title like "Beef" with "42 meals" in the `action` slot. Search results reuse the same page layout
- `filter.php?c=…` returns `idMeal`, `strMeal`, `strMealThumb`, `strArea` (**sometimes `null`**) and `strCountry`, but no category (the URL already has it). Cards must cope with a missing area
- Search is a route: `/search?q=chicken` (read with `useSearchParams()`, effect depends on `[query]`). Searches **on submit** (button or Enter), not while typing. Category page reads its name with `useParams()`
- No pagination for v1 (lists are ~10–85 meals, images are lazy). If needed later, a "Show more" button
- Spacing between sections: `space-y-…` on `<main>` (or the new `className` prop for one-offs)

**Pace:** one element per session. **Teaching style:** goal + a reminder from an earlier component, then Barry writes it. Fade the reminders for concepts he's already used (props, `useState`, callback props, ternaries, `.map()`).

## 🧹 Small loose ends

- [ ] Finish tidying `App.tsx`: merge the two `"react"` imports, `./lib/get` → `@/lib/get`, and update the dependency comment in the effect (it says `[]`, but it's `[attempt]` now)
- [ ] A 404 from `getCategories` isn't logged anywhere (only thrown errors are). Add `console.error(categoriesList.message)` in `App`'s error branch
- [ ] `ErrorMessage` polish: `type="button"`, `aria-hidden="true"` on the icon (instead of `aria-label`), rename `ErrorMessageType` → `ErrorMessageProps`. Make the title/text props so it can be reused for meals
- [ ] Optional: rename `src/lib/get.ts` → `api.ts`
- [ ] Later element: validate the API response with Zod in `getCategories` (TypeScript only _trusts_ `response.json()`)
- [ ] Install the **Oxc** extension in Cursor for live lint warnings (optional: Error Lens). (TypeScript Error Translator is installed ✅; `totalTypeScript.hideAllTips` hides its blue syntax tips.) Add `"typecheck": "tsc -b --noEmit"` to `package.json` scripts and run it before calling an element done
- [ ] Optional: `font-display text-deep-green` on the `CardGrid` heading to match the mockup
- [ ] **Clicking one heart favourites every card.** One shared `favourite` boolean. Fix once meals are real (unique IDs): store `favouriteIds: string[]` and pass `isFavourite={favouriteIds.includes(meal.idMeal)}`
- [ ] **Prettier isn't formatting on save yet** (on 2026-10-19, 8 files were unformatted). Check the status bar for "Prettier" ✓/✗ with a `.tsx` file open, and reload the window. Fallback: `npm run format`

## ✅ Done

### Session 5 (2026-10-19)

**Built**

- First commit, pushed to GitHub: [barrytickle/whats-cooking](https://github.com/barrytickle/whats-cooking) (branch `main`)
- `getCategories` wrapped in `try`/`catch` (offline/bad JSON → `"error"` result), uses `response.ok`
- `App`: `categoryStatus` (`"loading" | "success" | "error"`) replaces the boolean. Loading shows `CategoryCardPlaceholder`s, error shows `ErrorMessage`, success shows the cards
- `CategoryCardPlaceholder` sits in the same file as `CategoryCard`, sharing a `categoryCardStyles` object so their shapes stay in sync. It's a `<div>` (not clickable) with `animate-pulse`
- `src/components/ui/ErrorMessage.tsx` with an `onRetry` prop. "Try again" bumps an `attempt` counter that the effect depends on

**Learned along the way**

- **Two kinds of fetch failure:** a bad status (fetch _returns_, so check `response.ok`) vs no response at all (fetch _throws_)
- **`return` vs `throw`:** a function either hands back a value, or blows up and skips every line after it until a `catch`. Your own `return` can't help if the line before it threw
- Catch at the **edge** (in `getCategories`) and turn throws into normal returns, so callers only check `status`. A second `try`/`catch` around a function that never throws is redundant
- `await` must be **inside** the `try` for it to catch. Don't leave a `catch` empty. In `catch`, `error` is `unknown`, so use `error instanceof Error ? error.message : String(error)`
- Return for **expected** failures (offline, no results, missing A/B element); throw only for "the code itself is broken"
- One status union beats several booleans (`loaded` + `error` can disagree; `false` can't tell "loading" from "failed")
- Keep state for independent things separate (categories vs meals)
- The parent picks placeholder vs real card; placeholders need no props. Keep them beside the real component so they stay in sync. A little duplication beats the wrong abstraction
- **Retry trick:** a counter in the dependency array. The button changes the number, the effect re-runs. No need to pass the function around
- **Batching:** React groups state changes until your code finishes _or pauses at `await`_. So `setStatus("loading")` before an `await` renders straight away. `flushSync` forces an instant render (rarely needed)
- `: Type` labels a thing; `<Type>` fills in a generic (`useState<…>`, `Promise<…>`). `<X>` on its own looks like JSX. TypeScript has no `int`, only `number`
- Reading TypeScript errors: fix the first one first, read the last line of a long one. Ctrl+Space lists the types that really exist
- Test states on purpose: fake an error return, misspell the domain, or use DevTools → Network → Slow 4G

### Session 4 (2026-10-18)

**Built**

- `src/lib/get.ts`: `getCategories()` fetches `categories.php` and returns a typed success/error result (`CategoriesResult`)
- `App.tsx`: `categories` state filled by `useEffect` on load. **Real categories from TheMealDB on screen** 🎉
- `CardGrid`: named responsive `layout` (`"meals" | "categories"`, typed with `keyof typeof gridLayouts`), optional `action` slot and `className`. Container widened to `max-w-6xl`

**Learned along the way**

- **`useEffect`** runs side effects (like fetching) _after_ render. Its callback can't be `async`, so define an async function inside and call it (or an IIFE: `(async () => { ... })()`)
- **Dependency array:** a list of values React compares to the previous render. No array = every render (fetch → set state → render → loop). `[]` = once. `[x]` = once, then whenever `x` changes. Always an array. Dev mode runs effects twice on purpose
- An `async` function returns a **Promise**, so `await` it to get the value. Defining a function isn't calling it
- **Discriminated union:** `{ status: "success"; data } | { status: "error"; message }`. Use it when fields depend on the status. Checking `status` (or returning early on error) **narrows** the type
- Return types: `function f(): Promise<Result>` makes TypeScript check every `return`
- `Category[]` = `Array<Category>` = a list of `Category`. `< >` is a **generic**: a type that takes a type (`useState<Category[]>([])`, `Promise<…>`)
- `< >` holds types (erased before the browser), `( )` holds values. `useState([])` alone gives `never[]`, so state the type. An empty array is a valid `Category[]`
- Non-empty list type: `[Category, ...Category[]]` (only for data TypeScript can see; runtime data needs a check or Zod)
- TypeScript describes what you _expect_; `response.json()` is `any`, so only Zod can check what the API actually sent
- Unwrap API responses in the fetch function (`data.categories`) so components get exactly what they need
- Use real IDs as `key`s once data is real. Drop unused trailing `.map()` arguments; `_` is only for skipping earlier ones
- Always log and look at the real data
- `keyof typeof someMap` turns an object's keys into a type, so the map is the single source of truth
- Responsive grids: map a **named layout** to a full class string with all its breakpoints. Shared classes stay in the base string. Don't let base and layout both set `grid-cols-*` (clash)
- CSS `repeat(auto-fill, minmax(8rem, 1fr))` = "as many columns as fit, each at least 8rem". A no-breakpoints alternative
- Editors only flag errors in open files, and Vite doesn't type-check. Run `npx tsc -b --noEmit` + `npm run lint` to check the whole project

### Session 3 (2026-10-15)

**Built**

- `src/lib/types.ts`: `Category` type
- `src/components/categories/CategoryCard.tsx`: a `<button>` with the category's cut-out image and name, styled for TheMealDB's transparent PNGs rather than full photos
- Original mockup recovered into `design/original.png` (it has the category cards)
- `src/components/ui/CardGrid.tsx`: generic responsive grid with `title?`, `columns?: 4 | 5` (default 4) and `children`. Cards no longer have `max-w`, so the grid decides their width

**Learned along the way**

- `<a href>` = go somewhere (full page load, state resets). `<button onClick>` = do something on this page
- Event props start with `on` (`onClick`, `onToggle`). The card reports clicks; the parent decides what happens
- `onClick` on **your** component is just a prop name. You still wire it to the real element: `<button onClick={onClick}>`. `x={x}` = attribute name on the left, your variable on the right
- A `<button>` can only hold inline content, so use `<span>`, not `<h3>`
- `alt=""` when the text next to the image already says the same thing (otherwise screen readers say "Beef Beef"). Never leave `alt` out entirely
- `type="button"` stops a button submitting a form it's inside
- Match the real data, not just the mockup (cut-outs need padding + `object-contain`, not `object-cover`)
- **`children`**: whatever goes between a component's tags. Receive it like any prop (type `ReactNode`). Same idea as Gutenberg's `InnerBlocks`
- `{title && <h2>…</h2>}` renders only when there's a title. Never put JSX in backticks (it becomes text)
- `<section>` for a group of things, `<article>` for one self-contained item
- Lists: `.map()`, not `for` (JSX needs an expression). Every item needs a unique `key`. `Array.from({ length: n })` makes test arrays
- `gap` works for grid and flex, and only adds space _between_ items
- **Tailwind can't see built class names** (`md:grid-cols-${n}`). Map values to full class strings, like `Tag`'s `variantClasses`
- Optional props with defaults: `columns?: 4 | 5` in the type, `columns = 4` in the destructuring. `??` = "unless null/undefined"
- Capitals are for components and types; constants are camelCase

### Session 2 (2026-10-14)

**Built**

- `src/components/ui/FavouriteButton.tsx`: icon button with outline/filled SVG hearts, `aria-label`, flex-centred
- `MealCard` now takes `isFavourite` + `onToggleFavourite` and shows the button in the photo's top-right corner
- `App.tsx`: first `useState`, toggling the test meal's favourite

**Design**

- Search page and recipe page mockups in `design/`, with notes on what TheMealDB can and can't support (`design/README.md`)

**Learned along the way**

- Hooks (`useState`) go **inside** a component; give them a starting value so TypeScript knows the type
- A function prop is typed `() => void`. Pass a toggle (`() => setFav(!fav)`), not the raw setter
- Ternary in JSX: `{cond ? a : b}`. A function component must `return` its JSX
- SVG in JSX: no backticks; dashed attributes become camelCase (`strokeWidth`); `currentColor` follows the text colour
- Inline SVG sits on the text baseline → centre it with `inline-flex items-center justify-center`
- `className` only works on HTML elements, so wrap a component in a `<div>` to position it
- **Controlled components:** the button only draws and reports clicks; the owner (`App`, later Zustand) holds the state
- Passing props down through layers = **prop drilling**. Fine for 1–2 levels; Zustand/Context fix it later. Stay light until it hurts
- Keep props flat; `types.ts` is for shared data shapes, not one component's inputs

### Session 1 (2026-10-08)

**Setup**

- Vite 8 + React 19 + TypeScript 6 (strict + `noUncheckedIndexedAccess`), Tailwind 4, React Router 8, Zod 4, oxlint
- Design system from the mockup in `src/index.css` (`bg-tomato`, `text-deep-green`, `bg-cream`, `bg-sand`, `bg-sage`, `text-ink`, `font-display`)
- Prettier + Tailwind class sorting (`npm run format`)
- Design mockup generated from a prompt that only uses what TheMealDB provides

**Planning**

- Broke the design into components and decided where state lives (see "Component plan" in `HOW-IT-WORKS.md`)

**Built**

- `src/lib/types.ts`: shared `Meal` type
- `src/components/ui/Tag.tsx`: pill with `"category" | "area"` variants
- `src/components/meal/MealCard.tsx`: `<article>`, lazy image with aspect ratio, clamped title, two Tags

**Learned along the way**

- A component gets **one props object**; destructure it
- Union types enforce the design system; map variants to full Tailwind class names
- Inline elements ignore vertical padding → `inline-flex items-center`
- Fixed height + vertical padding fight (`border-box`)
- Parents handle spacing, width and "no data"; components just draw what they're given
- Props are read-only; keep test data in the parent
- IDs as strings; `type` vs `interface`; `import type` (`verbatimModuleSyntax`)
- TypeScript describes the shape; Zod checks the content

## 🗺️ The road ahead

**Version 1:** ~~Tag~~ → ~~MealCard~~ → ~~FavouriteButton~~ → ~~CategoryCard~~ → ~~CardGrid~~ → ~~fetch categories~~ → ~~loading/error states~~ → **"Something to try"** random meals (`Promise.all`) → React Router: `/`, `/category/:name`, `/meal/:id` → category page (meals grid, `<Link>` from category cards) → SearchBar + search results (same page layout) → MealDetail page from `design/recipe.webp` (ingredients transform, steps, video button) → Feeling lucky

**Version 2:** `/favourites` page → favourites in localStorage → sort A–Z

**Version 3:** Zustand → TanStack Query → deploy to Vercel

**After the course:** a **TypeScript rundown**: one page covering everything used in the project (`:` vs `< >`, unions, discriminated unions + narrowing, generics, `keyof typeof`, optional props, `unknown` in `catch`, ...) with examples from Barry's own code. Barry asked for this on 2026-10-19.

**Then:** back to the Next.js Pokédex (`~/pokedex`), which has its data layer done and is waiting on rendering the list. See its own `HOW-IT-WORKS.md`.
