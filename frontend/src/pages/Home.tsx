import MainHeader from "../components/MainHeader.tsx";
import LibraryToolbar from "../components/LibraryToolbar.tsx";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      < MainHeader />
      < LibraryToolbar />
    </div>
  );
}