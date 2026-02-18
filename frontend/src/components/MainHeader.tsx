import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MainHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 cursor-pointer">
        <h1 onClick={() => navigate("/")} className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl cursor-pointer">
          Shelf Jolt
        </h1>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-gray-900 cursor-pointer"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <nav className="hidden sm:block">
          <ul className="flex items-center gap-8 text-sm text-gray-700">
            <li>
              <Link to="/sobre" className="hover:text-gray-900">
                Sobre
              </Link>
            </li>
            <li>
              <Link to="/contato" onClick={() => setIsOpen(false)} className="hover:text-gray-900">
                Contato
              </Link>
            </li>
            <li>
              <Link to="/cadastro" className="rounded-md bg-[#8B5E66] px-4 py-2 text-white transition hover:bg-[#7A4D54]">
                Registrar-se
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {isOpen && (
        <nav className="sm:hidden border-t border-gray-200 px-6 pb-5">
          <ul className="flex flex-col gap-4 pt-4 text-sm text-gray-700">
            <li>
              <Link to="/sobre" onClick={() => setIsOpen(false)} className="hover:text-gray-900">
                Sobre
              </Link>
            </li>
            <li>
              <Link to="/contato" onClick={() => setIsOpen(false)} className="hover:text-gray-900">
                Contato
              </Link>
            </li>
            <li>
              <Link
                to="/cadastro"
                className="block w-full rounded-md bg-[#8B5E66] px-4 py-2 text-center text-white transition hover:bg-[#7A4D54]"
              >
                Registrar-se
              </Link  >
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
