import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome da categoria deve ter pelo menos 2 caracteres")
    .max(60, "Nome da categoria deve ter no máximo 60 caracteres"),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome da categoria deve ter pelo menos 2 caracteres")
    .max(60, "Nome da categoria deve ter no máximo 60 caracteres"),
});

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
