type ErrorMessageType = {
  onRetry: () => void;
};

export function ErrorMessage({ onRetry }: ErrorMessageType) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-label="Warning"
      >
        <circle cx="12" cy="12" r="10" stroke="#df1010" strokeWidth="1.5" />
        <path d="M12 6.5v8" stroke="#df1010" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="12" cy="17.75" r="1" fill="#df1010" />
      </svg>
      <h3 className="text-2xl font-semibold">Error Loading Categories</h3>
      <p>There was an error loading the categories. Please try again.</p>
      <button
        className="cursor-pointer rounded-lg bg-tomato px-5.5 py-4 text-white hover:bg-amber-700"
        onClick={onRetry}
      >
        Try again
      </button>
    </div>
  );
}
