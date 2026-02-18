import { useState } from "react";

export default function formCadastro() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="bg-white rounded-3xl shadow-md px-10 py-10 mb-10 max-w-md mx-auto mt-8">
            <h2 className="text-3xl font-semibold text-gray-800">Cadastrar</h2>

            <form className="mt-8 space-y-5">
                <div className="space-y-4">
                    <label htmlFor="name">
                        Nome
                    </label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Insira seu nome"
                        className="w-full rounded-xl border border-[#D8B69A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D8B69A]/40"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-700" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="ShelfJolt@gmail.com"
                        className="w-full rounded-xl border border-[#D8B69A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D8B69A]/40"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700" htmlFor="password">
                            Senha
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Insira Sua Senha"
                            className="w-full rounded-xl border border-[#D8B69A] px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[#D8B69A]/40"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            aria-pressed={showPassword}
                            onClick={() => setShowPassword((current) => !current)}
                        >
                            {showPassword ? (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M2 12C3.6 7.9 7.5 5 12 5C16.5 5 20.4 7.9 22 12C20.4 16.1 16.5 19 12 19C7.5 19 3.6 16.1 2 12Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                    <path
                                        d="M4 4L20 20"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M2 12C3.6 7.9 7.5 5 12 5C16.5 5 20.4 7.9 22 12C20.4 16.1 16.5 19 12 19C7.5 19 3.6 16.1 2 12Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700" htmlFor="password">
                            Confirmar Senha
                        </label>

                    </div>

                    <div className="relative">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirme Sua Senha"
                            className="w-full rounded-xl border border-[#D8B69A] px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[#D8B69A]/40"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                            aria-pressed={showConfirmPassword}
                            onClick={() => setShowConfirmPassword((current) => !current)}
                        >
                            {showConfirmPassword ? (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M2 12C3.6 7.9 7.5 5 12 5C16.5 5 20.4 7.9 22 12C20.4 16.1 16.5 19 12 19C7.5 19 3.6 16.1 2 12Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                    <path
                                        d="M4 4L20 20"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M2 12C3.6 7.9 7.5 5 12 5C16.5 5 20.4 7.9 22 12C20.4 16.1 16.5 19 12 19C7.5 19 3.6 16.1 2 12Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full rounded-xl bg-[#8B5E66] py-3 font-semibold text-white cursor-pointer hover:bg-[#7A4C53] transition"
                >
                    Criar Conta
                </button>

                <button
                    type="button"
                    className="w-full rounded-xl border border-gray-100 bg-[#FBF7F2] py-3 font-semibold text-[#8B5E66] cursor-pointer hover:bg-[#E8E0D7] transition"
                >
                    <span className="inline-flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white">
                            G
                        </span>
                        Continue com o Google
                    </span>
                </button>

                <p className="text-center text-sm text-gray-400">
                    Ja Tem Uma Conta? <span className="text-[#8B5E66] cursor-pointer hover:underline">Log In</span>
                </p>
            </form>
        </div>
    )
}