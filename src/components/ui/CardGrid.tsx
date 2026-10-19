import type { ReactNode } from "react";

type CardGridProps = {
  title?: string;
  layout?: keyof typeof gridLayouts;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
};

const gridLayouts = {
  meals: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  categories: "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8",
};

export function CardGrid({ title, children, layout = "meals", action, className }: CardGridProps) {
  return (
    <section className={className}>
      <div className="flex items-center justify-between">
        {title && <h2 className="mb-4 text-2xl font-bold">{title}</h2>}
        {action}
      </div>
      <div className={`grid gap-4 ${gridLayouts[layout]}`}>{children}</div>
    </section>
  );
}
