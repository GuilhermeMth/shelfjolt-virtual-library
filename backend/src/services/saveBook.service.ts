import prisma from "../prisma/prisma";
import { Prisma } from "../../generated/prisma/client";
import type { BookResponse } from "../@types/book.types";

export class SaveBookService {
  /**
   * Salva um livro na estante do usuário
   */
  async saveBook(userId: number, bookId: number): Promise<{ message: string }> {
    // Verifica se o livro existe
    const bookExists = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true },
    });

    if (!bookExists) {
      throw new Error("Livro não encontrado");
    }

    try {
      // Usa create direto - a constraint única no banco previne duplicação
      await prisma.saveBook.create({
        data: {
          userId,
          bookId,
        },
      });

      return { message: "Livro salvo com sucesso" };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("Livro já está salvo na sua estante");
      }
      throw error;
    }
  }

  /**
   * Remove um livro da estante do usuário
   */
  async unsaveBook(
    userId: number,
    bookId: number,
  ): Promise<{ message: string }> {
    try {
      await prisma.saveBook.delete({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });

      return { message: "Livro removido da estante" };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("Livro não está na sua estante");
      }
      throw error;
    }
  }

  /**
   * Lista todos os livros salvos do usuário com filtros
   */
  async getSavedBooks(
    userId: number,
    options?: {
      page?: number;
      limit?: number;
      search?: string;
      categories?: number[];
      language?: string;
      sortBy?: "recent" | "popular" | "title" | "author" | "savedAt";
    },
  ): Promise<{
    books: BookResponse[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 20,
      search,
      categories,
      language,
      sortBy = "savedAt",
    } = options || {};
    const skip = (page - 1) * limit;

    // Build where clause for books
    const bookWhere: Prisma.BookWhereInput = {
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
          {
            author: {
              name: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          },
        ],
      }),
      ...(categories &&
        categories.length > 0 && {
          categories: {
            some: {
              categoryId: {
                in: categories,
              },
            },
          },
        }),
      ...(language && { language }),
    };

    // Build order by
    let orderBy:
      | Prisma.SaveBookOrderByWithRelationInput
      | Prisma.SaveBookOrderByWithRelationInput[] = {
      createdAt: "desc",
    };

    if (sortBy === "savedAt") {
      orderBy = { createdAt: "desc" };
    } else if (sortBy === "recent") {
      orderBy = { book: { published: "desc" } };
    } else if (sortBy === "popular") {
      orderBy = { book: { viewCount: "desc" } };
    } else if (sortBy === "title") {
      orderBy = { book: { title: "asc" } };
    } else if (sortBy === "author") {
      orderBy = { book: { author: { name: "asc" } } };
    }

    const [savedBooks, total] = await Promise.all([
      prisma.saveBook.findMany({
        where: {
          userId,
          book: bookWhere,
        },
        skip,
        take: limit,
        orderBy,
        include: {
          book: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              categories: {
                include: {
                  category: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.saveBook.count({
        where: {
          userId,
          book: bookWhere,
        },
      }),
    ]);

    const transformedBooks: BookResponse[] = savedBooks.map((saved) => {
      const { authorId, ...bookWithoutAuthorId } = saved.book;
      return {
        ...bookWithoutAuthorId,
        categories: saved.book.categories.map((bc) => bc.category),
      };
    });

    return {
      books: transformedBooks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Verifica se um livro está salvo pelo usuário
   */
  async isBookSaved(userId: number, bookId: number): Promise<boolean> {
    const saved = await prisma.saveBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    return !!saved;
  }
}
