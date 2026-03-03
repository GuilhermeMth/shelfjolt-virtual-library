import { z } from "zod";

const emailSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z.email("E-mail inválido"),
);

export const registerSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(50, "Nome muito longo"),
  email: emailSchema,
  password: z.string().min(6, "Senha muito curta").max(32, "Senha muito longa"),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, "Senha muito curta").max(32, "Senha muito longa"),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
