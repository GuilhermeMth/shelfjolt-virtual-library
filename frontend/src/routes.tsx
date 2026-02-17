import { Routes, Route } from "react-router-dom";
import Home from "./pages/index.tsx";

export function MainRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="*" element={<Home />} />
		</Routes>
	);
}
