import { api } from "./api";
import { removeToken } from "../Functions/Storage";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

interface authResponse {
  access_token?: string;
  user: any;
}

export async function register(data: RegisterDTO, confirmPassword: string) {
  const isPasswordEqual = confirmPassword === data.password;
  if (!isPasswordEqual) {
    throw new Error("As senhas não coincidem.");
  }
  const response = await api<authResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function login(data: LoginDTO) {
  return api<authResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logout() {
  removeToken();
}

// Autenticação social com Firebase (login/cadastro)
export async function authenticateWithFirebase(firebaseToken: string) {
  const response = await api<authResponse>("/auth/login/firebase", {
    method: "POST",
    body: JSON.stringify({ firebaseToken }),
  });
  return response.data;
}
