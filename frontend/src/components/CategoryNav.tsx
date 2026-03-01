type CategoryNavProps = {
  categories?: string[];
  active?: string;
  onSelect?: (category: string) => void;
};

const defaultCategories = [
  "Romance",
  "Comedia",
  "Fantasia",
  "Ficcao Cientifica",
  "HQs",
  "Infantil",
  "Romance",
  "Comedia",
  "Fantasia",
  "Ficcao Cientifica",
  "HQs",
  "Infantil",
  "Romance",
  "Comedia",
  "Fantasia",
];
 
export default function CategoryNav({
  categories = defaultCategories,
  active,
  onSelect,
}: CategoryNavProps) {
  return (
    <nav className="w-full bg-gray-700">
      <ul className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-6 py-2 text-sm text-white">
        {categories.map((category, index) => {
          const isActive = active === category;

          return (
            <li key={`${category}-${index}`}>
              <button
                type="button"
                onClick={() => onSelect?.(category)}
                className={
                  isActive
                    ? "cursor-pointer text-white underline underline-offset-4"
                    : "cursor-pointer text-white/90 hover:text-white"
                }
              >
                {category}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
