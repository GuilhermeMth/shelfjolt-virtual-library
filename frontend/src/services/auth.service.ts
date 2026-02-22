import { api } from "./api";
import { removeToken } from "../Functions/Storage";

interface authDTO {
  email: string;
  password: string;
}

interface authResponse {
  access_token?: string;
  user: any;
}

export async function register(data: authDTO, confirmPassword: string) {
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

export async function login(data: authDTO) {
  return api<authResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logout() {
  removeToken();
}
