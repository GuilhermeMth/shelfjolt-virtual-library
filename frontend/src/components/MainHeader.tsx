import { useState } from "react";

export default function MainHeader() {

	return (
		  <header className="w-full bg-white shadow-sm">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">Shelf Jolt</h1>
                <nav className="w-full sm:w-auto">
                    <ul className="flex w-full flex-col items-start gap-3 text-sm text-gray-700 sm:w-auto sm:flex-row sm:items-center sm:gap-8">
                        <li>
                            <a href="#" className="hover:text-gray-900">Sobre</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-gray-900">Contato</a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="w-full rounded-md bg-[#8B5E66] px-4 py-2 text-center font-medium text-white shadow-sm transition hover:bg-[#7A4D54] sm:w-auto"
                            >
                                Registra-se
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
	);
}

