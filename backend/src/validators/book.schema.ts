import { z } from "zod";

const trimmedUrl = (message: string) =>
  z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z.url(message),
  );

const normalizeFileUrl = (value: string): string => {
  const trimmed = value.trim();

  const isGoogleDrive =
    trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com");

  if (!isGoogleDrive) return trimmed;

  // Ex.: .../view?usp=sharing -> .../view
  return trimmed.split("#")[0]?.split("?")[0] ?? trimmed;
};

const fileUrlSchema = trimmedUrl("URL do arquivo inválida").transform(
  normalizeFileUrl,
);

const optionalCoverUrlSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;

    const trimmed = value.trim();

    if (trimmed === "") return undefined;
    if (trimmed.toLowerCase() === "null") return null;

    return trimmed;
  },
  z
    .union([
      z.null(),
      z.url("URL da capa inválida"),
      z.string().regex(/^\/uploads\/covers\/.+$/, "URL da capa inválida"),
    ])
    .optional(),
);

const normalizeSlug = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const slugSchema = z
  .string()
  .transform(normalizeSlug)
  .refine((slug) => slug.length >= 2, {
    message: "Slug deve ter pelo menos 2 caracteres",
  })
  .refine((slug) => slug.length <= 180, {
    message: "Slug deve ter no máximo 180 caracteres",
  });

export const createBookSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Título deve ter pelo menos 2 caracteres")
      .max(160, "Título deve ter no máximo 160 caracteres"),
    slug: slugSchema,
    description: z
      .string()
      .trim()
      .max(5000, "Descrição muito longa")
      .nullable()
      .optional(),
    fileUrl: fileUrlSchema,
    coverPath: optionalCoverUrlSchema,
    coverUrl: optionalCoverUrlSchema,
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
  })
  .transform(({ coverPath, coverUrl, ...data }) => ({
    ...data,
    coverPath: coverPath ?? coverUrl,
  }));

export const updateBookSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Título deve ter pelo menos 2 caracteres")
      .max(160, "Título deve ter no máximo 160 caracteres")
      .optional(),
    slug: slugSchema.optional(),
    description: z
      .string()
      .trim()
      .max(5000, "Descrição muito longa")
      .nullable()
      .optional(),
    fileUrl: fileUrlSchema.optional(),
    coverPath: optionalCoverUrlSchema,
    coverUrl: optionalCoverUrlSchema,
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
  .transform(({ coverPath, coverUrl, ...data }) => ({
    ...data,
    ...(coverPath !== undefined || coverUrl !== undefined
      ? { coverPath: coverPath ?? coverUrl }
      : {}),
  }))
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualização",
  });

export type CreateBookDTO = z.infer<typeof createBookSchema>;
export type UpdateBookDTO = z.infer<typeof updateBookSchema>;
