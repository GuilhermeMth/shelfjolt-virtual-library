type SearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Pesquise por um titulo, autor ou categoria",
}: SearchBarProps) {
  return (
    <form
      className="flex w-full max-w-3xl items-center gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value);
      }}
    >
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
      />
      <button
        type="submit"
        className="grid h-11 w-11 cursor-pointer place-items-center rounded-md bg-white text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50"
        aria-label="Pesquisar"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.65" y1="16.65" x2="21" y2="21" />
        </svg>
      </button>
    </form>
  );
}
