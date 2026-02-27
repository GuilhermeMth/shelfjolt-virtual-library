import SearchBar from "./SearchBar";
import HeaderActions from "./HeaderActions";
import CategoryNav from "./CategoryNav";

export default function LibraryToolbar() {
  return (
    <div className="w-full">
      <div className="w-full bg-gray-900">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3">
          <SearchBar placeholder="Pesquise por um titulo, autor ou categoria" />
          <HeaderActions />
        </div>
      </div>
      <CategoryNav />
    </div>
  );
}
