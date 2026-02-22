import { useNavigate } from "react-router-dom";

export default function SecundaryHeader() {
    const navigate = useNavigate();
    return (
        <header className="w-full bg-white shadow-sm py-5 px-6">
            <h1 onClick={() => navigate("/")} className="text-2xl font-semibold tracking-tight sm:text-3xl text-center cursor-pointer">
                  Shelf Jolt
            </h1>
        </header>
    )
}