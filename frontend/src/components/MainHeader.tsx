import { useState } from "react";

export default function MainHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Shelf Jolt
        </h1>

        {/* Botão Mobile */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-gray-900"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              // Ícone X
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Ícone Hambúrguer
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Menu Desktop */}
        <nav className="hidden sm:block">
          <ul className="flex items-center gap-8 text-sm text-gray-700">
            <li>
              <a href="#" className="hover:text-gray-900">
                Sobre
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Contato
              </a>
            </li>
            <li>
              <a
                href="#"
                className="rounded-md bg-[#8B5E66] px-4 py-2 text-white transition hover:bg-[#7A4D54]"
              >
                Registrar-se
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <nav className="sm:hidden border-t border-gray-200 px-6 pb-5">
          <ul className="flex flex-col gap-4 pt-4 text-sm text-gray-700">
            <li>
              <a href="#" className="hover:text-gray-900">
                Sobre
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Contato
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block w-full rounded-md bg-[#8B5E66] px-4 py-2 text-center text-white transition hover:bg-[#7A4D54]"
              >
                Registrar-se
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
