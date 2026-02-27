import Footer from "./components/MainFooter";
import { MainRoutes } from "./routes";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <MainRoutes />
      </main>
      <Footer />
    </div>
  );
}