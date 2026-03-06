import { z } from "zod";

export const catalogQuerySchema = z.object({
  // Pesquisa por texto (título, descrição, autor)
  search: z.string().trim().optional(),

  // Filtro por categorias (aceita múltiplas: ?categories=1,2,3)
  categories: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n)),
    )
    .optional(),

  // Filtro por idioma
  language: z.string().trim().optional(),

  // Paginação
  page: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive())
    .default(1),

  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive().max(100))
    .default(20),

  // Ordenação
  sortBy: z.enum(["recent", "popular", "title", "author"]).default("recent"),
});

export type CatalogQuery = z.infer<typeof catalogQuerySchema>;
