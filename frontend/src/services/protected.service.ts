import { api } from "./api";
import { getToken } from "../Functions/Storage";

export async function getProtectedData() {
  const token = getToken();
  return api<{ message: string; user: any }>("/protected", {}, token!);
}
