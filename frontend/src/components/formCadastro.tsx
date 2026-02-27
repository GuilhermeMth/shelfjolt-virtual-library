import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/auth.service";
import { setToken } from "../Functions/Storage";

export default function FormCadastro() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setForm((current) => ({ ...current, [id]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      const data = await register(
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        form.confirmPassword,
      );
      if (data && data.access_token) {
        setToken(data.access_token);
      }
      setSuccess("Conta criada com sucesso");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err?.message || "Erro ao cadastrar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg px-8 py-5 mb-6 max-w-md mx-auto mt-10 border border-[#E8E0D7]">
      <h2 className="text-2xl font-bold text-[#8B5E66] mb-4 tracking-tight">
        Cadastrar
      </h2>

      <form className="mt-1 space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-sm text-gray-700" htmlFor="name">
            Nome
          </label>
          <input
            id="name"
            type="text"
            placeholder="Seu nome completo"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#D8B69A] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#D8B69A]/40 bg-[#FBF7F2]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="ShelfJolt@gmail.com"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#D8B69A] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#D8B69A]/40 bg-[#FBF7F2]"
          />
        </div>

        <div className="space-y-1">
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
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#D8B69A] px-4 py-3 pr-12 text-base outline-none focus:ring-2 focus:ring-[#D8B69A]/40 bg-[#FBF7F2]"
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
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
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
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700" htmlFor="confirmPassword">
              Confirmar Senha
            </label>
          </div>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme Sua Senha"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#D8B69A] px-4 py-3 pr-12 text-base outline-none focus:ring-2 focus:ring-[#D8B69A]/40 bg-[#FBF7F2]"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              aria-label={
                showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
              }
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
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
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
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-xl bg-[#8B5E66] py-2 font-semibold text-white text-base cursor-pointer hover:bg-[#7A4C53] transition disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Criar Conta"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-2">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-[#8B5E66] cursor-pointer hover:underline font-medium"
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
