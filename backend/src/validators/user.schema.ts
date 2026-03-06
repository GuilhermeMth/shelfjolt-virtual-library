import { z } from "zod";

const emailSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z.email("E-mail inválido"),
);

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome obrigatório")
    .max(50, "Nome muito longo"),
  email: emailSchema,
  password: z
    .string()
    .min(6, "Senha muito curta")
    .max(32, "Senha muito longa")
    .optional(),
  google_id: z.string().trim().min(1, "google_id inválido").optional(),
});

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Nome obrigatório")
      .max(50, "Nome muito longo")
      .optional(),
    email: emailSchema.optional(),
    password: z
      .string()
      .min(6, "Senha muito curta")
      .max(32, "Senha muito longa")
      .nullable()
      .optional(),
    google_id: z
      .string()
      .trim()
      .min(1, "google_id inválido")
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualização",
  });

export const usersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .optional()
    .default("20")
    .transform(Number)
    .pipe(z.number().int().positive().max(100)),
  search: z.string().trim().optional(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UsersQueryDTO = z.infer<typeof usersQuerySchema>;
