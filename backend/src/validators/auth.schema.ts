import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(50, "Nome muito longo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta").max(32, "Senha muito longa"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta").max(32, "Senha muito longa"),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
