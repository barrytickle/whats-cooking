type FavouriteButtonProps = {
  isFavourite: boolean;
  onToggle: () => void;
};

const heartImageMap = {
  emptyHeart: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-6.716-4.35-9.193-8.18C.86 9.78 2.09 5.5 6.09 4.39c2.18-.6 4.02.34 5.91 2.27 1.89-1.93 3.73-2.87 5.91-2.27 4 1.11 5.23 5.39 3.28 8.43C18.716 16.65 12 21 12 21z" />
    </svg>
  ),
  filledHeart: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 21s-6.716-4.35-9.193-8.18C.86 9.78 2.09 5.5 6.09 4.39c2.18-.6 4.02.34 5.91 2.27 1.89-1.93 3.73-2.87 5.91-2.27 4 1.11 5.23 5.39 3.28 8.43C18.716 16.65 12 21 12 21z" />
    </svg>
  ),
};

export function FavouriteButton({ isFavourite, onToggle }: FavouriteButtonProps) {
  return (
    <button
      type="button"
      aria-label="Favourite"
      className={`inline-flex min-h-5 min-w-5 cursor-pointer items-center justify-center rounded-full bg-white p-3 transition-all hover:bg-gray-100 ${isFavourite ? "text-tomato" : ""}`}
      onClick={onToggle}
    >
      {isFavourite ? heartImageMap.filledHeart : heartImageMap.emptyHeart}
    </button>
  );
}
