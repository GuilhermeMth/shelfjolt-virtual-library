import { z } from "zod";

export const savedBooksQuerySchema = z.object({
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

  // Ordenação (inclui "savedAt" para ordenar por data que salvou)
  sortBy: z
    .enum(["savedAt", "recent", "popular", "title", "author"])
    .default("savedAt"),
});

export type SavedBooksQuery = z.infer<typeof savedBooksQuerySchema>;
