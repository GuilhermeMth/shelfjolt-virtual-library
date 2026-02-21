import { useState } from "react";
import { Link } from "react-router-dom";

export default function FormLogin(): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-3xl shadow-md px-10 py-10 mb-10 max-w-md mx-auto mt-8">
      <h2 className="text-3xl font-semibold text-gray-800">Entrar</h2>

      <form className="mt-8 space-y-5">
        <div className="space-y-2">
          <label className="text-sm text-gray-700" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="seuemail@gmail.com"
            className="w-full rounded-xl border border-[#D8B69A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D8B69A]/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-700" htmlFor="password">
            Senha
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Insira sua senha"
              className="w-full rounded-xl border border-[#D8B69A] px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[#D8B69A]/40"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              👁
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#8B5E66] py-3 font-semibold text-white hover:bg-[#7A4C53] transition"
        >
          Entrar
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
          Ainda não tem uma conta?{" "}
          <Link
            to="/cadastro"
            className="text-[#8B5E66] hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
