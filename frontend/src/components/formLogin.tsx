import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { login } from "../services/auth.service";
import { authenticateWithFirebase } from "../services/auth.service";
import { setToken } from "../Functions/Storage";

export default function FormLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const { data } = await login({
        email: form.email,
        password: form.password,
      });
      if (data?.access_token) {
        setToken(data.access_token);
        navigate("/protegida");
        return;
      }
      setSuccess("Login realizado com sucesso");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      setError(err?.message || "Erro ao entrar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      // Chama o serviço centralizado
      const data = await authenticateWithFirebase(token);
      if (data && data.access_token) {
        setToken(data.access_token);
        navigate("/protegida");
        return;
      }
      setSuccess("Login com Google realizado com sucesso");
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setError("Erro ao entrar com Google");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg px-8 py-8 mb-8 max-w-md mx-auto mt-12 border border-[#E8E0D7]">
      <h2 className="text-2xl font-bold text-[#8B5E66] mb-6 tracking-tight">
        Entrar
      </h2>

      <form className="mt-2 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm text-gray-700" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="seuemail@gmail.com"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#D8B69A] px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#D8B69A]/40 bg-[#FBF7F2]"
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
          className="w-full rounded-xl bg-[#8B5E66] py-3 font-semibold text-white text-base cursor-pointer hover:bg-[#7A4C53] transition disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Entrar"}
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full rounded-xl border border-gray-100 bg-[#FBF7F2] py-3 font-semibold text-[#8B5E66] text-base cursor-pointer hover:bg-[#E8E0D7] transition disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
          disabled={isSubmitting}
        >
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white">
              <img src="/src/assets/google-logo.svg" alt="Google logo" className="h-5 w-5" />
            </span>
            Continue com o Google
          </span>
        </button>
        <p className="text-center text-xs text-gray-400 mt-4">
          Ainda não tem uma conta?{" "}
          <Link
            to="/cadastro"
            className="text-[#8B5E66] hover:underline font-medium"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
