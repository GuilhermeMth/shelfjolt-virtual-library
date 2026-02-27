import { Routes, Route } from "react-router-dom";
import Index from "./pages/index.tsx";
import Cadastro from "./pages/cadastro.tsx";
import Login from "./pages/login.tsx";
import ProtectedPage from "./pages/ProtectedPage";
import Home from "./pages/Home.tsx";

export function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<Index />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/protegida" element={<ProtectedPage />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}
