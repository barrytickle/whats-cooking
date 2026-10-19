type TagProps = {
  name: string;
  variant: "category" | "area";
};

const variantClasses = {
  category: "bg-tomato/15 text-tomato",
  area: "bg-sage/25 text-deep-green",
};

export function Tag({ name, variant }: TagProps) {
  return (
    <span
      className={`inline-flex w-fit items-center justify-center rounded-full px-3 py-2 text-sm leading-none ${variantClasses[variant]}`}
    >
      {name}
    </span>
  );
}
