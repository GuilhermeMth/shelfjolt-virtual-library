import { z } from "zod";

const trimmedUrl = (message: string) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.url(message),
  );

export const createBookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Título deve ter pelo menos 2 caracteres")
    .max(160, "Título deve ter no máximo 160 caracteres"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug deve ter pelo menos 2 caracteres")
    .max(180, "Slug deve ter no máximo 180 caracteres"),
  description: z
    .string()
    .trim()
    .max(5000, "Descrição muito longa")
    .nullable()
    .optional(),
  fileUrl: trimmedUrl("URL do arquivo inválida"),
  coverPath: z.union([z.null(), trimmedUrl("URL da capa inválida")]).optional(),
  language: z
    .string()
    .trim()
    .min(2, "Idioma inválido")
    .max(20, "Idioma inválido"),
  categoryIds: z
    .array(
      z
        .number()
        .int("ID de categoria inválido")
        .positive("ID de categoria inválido"),
    )
    .min(1, "Pelo menos uma categoria é obrigatória"),
});

export const updateBookSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Título deve ter pelo menos 2 caracteres")
      .max(160, "Título deve ter no máximo 160 caracteres")
      .optional(),
    slug: z
      .string()
      .trim()
      .min(2, "Slug deve ter pelo menos 2 caracteres")
      .max(180, "Slug deve ter no máximo 180 caracteres")
      .optional(),
    description: z
      .string()
      .trim()
      .max(5000, "Descrição muito longa")
      .nullable()
      .optional(),
    fileUrl: trimmedUrl("URL do arquivo inválida").optional(),
    coverPath: z
      .union([z.null(), trimmedUrl("URL da capa inválida")])
      .optional(),
    language: z
      .string()
      .trim()
      .min(2, "Idioma inválido")
      .max(20, "Idioma inválido")
      .optional(),
    categoryIds: z
      .array(
        z
          .number()
          .int("ID de categoria inválido")
          .positive("ID de categoria inválido"),
      )
      .min(1, "Pelo menos uma categoria é obrigatória")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualização",
  });

export type CreateBookDTO = z.infer<typeof createBookSchema>;
export type UpdateBookDTO = z.infer<typeof updateBookSchema>;
