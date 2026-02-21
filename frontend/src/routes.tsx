import { Routes, Route } from "react-router-dom";
import Home from "./pages/index.tsx";
import Cadastro from "./pages/cadastro.tsx";
import Login from "./pages/login.tsx";

export function MainRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="*" element={<Home />} />
			<Route path="/cadastro" element={<Cadastro />} />
			<Route path="/login" element={<Login />} />
		</Routes>
	);
}
