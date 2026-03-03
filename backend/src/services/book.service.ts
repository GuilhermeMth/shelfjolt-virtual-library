import prisma from "../prisma/prisma";
import { Prisma } from "../../generated/prisma/client";
import type {
  BookCreateDTO,
  BookUpdateDTO,
  BookResponse,
} from "../@types/book.types";

export class ServiceError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export class BookService {
  private async validateCategoryIds(categoryIds: number[]): Promise<number[]> {
    const uniqueCategoryIds = [...new Set(categoryIds)];

    if (uniqueCategoryIds.length === 0) {
      throw new ServiceError(400, "Pelo menos uma categoria é obrigatória");
    }

    const categories = await prisma.category.findMany({
      where: { id: { in: uniqueCategoryIds } },
      select: { id: true },
    });

    if (categories.length !== uniqueCategoryIds.length) {
      throw new ServiceError(400, "Uma ou mais categorias são inválidas");
    }

    return uniqueCategoryIds;
  }

  async createBook(data: BookCreateDTO): Promise<BookResponse> {
    const { categoryIds, ...bookData } = data;
    const validCategoryIds = await this.validateCategoryIds(categoryIds);

    // Check if slug already exists (BEFORE any create attempt)
    const existingSlug = await prisma.book.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    });

    if (existingSlug) {
      throw new ServiceError(409, "Slug já está em uso");
    }

    // Check for duplicate books by same author (fileUrl + coverPath)
    const duplicateByFileAndCover = await prisma.book.findFirst({
      where: {
        authorId: data.authorId,
        fileUrl: data.fileUrl,
        ...(data.coverPath !== undefined ? { coverPath: data.coverPath } : {}),
      },
    });

    if (duplicateByFileAndCover) {
      throw new ServiceError(
        409,
        "Você já publicou um livro com este arquivo e capa",
      );
    }

    // Check for duplicate books by same author (title + fileUrl)
    const duplicateByTitleAndFile = await prisma.book.findFirst({
      where: {
        authorId: data.authorId,
        title: data.title,
        fileUrl: data.fileUrl,
      },
    });

    if (duplicateByTitleAndFile) {
      throw new ServiceError(
        409,
        "Você já publicou um livro com este título e arquivo",
      );
    }

    try {
      const book = await prisma.book.create({
        data: {
          ...bookData,
          categories: {
            create: validCategoryIds.map((categoryId) => ({
              categoryId,
            })),
          },
        },
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
      });

      const { authorId, ...bookWithoutAuthorId } = book;

      return {
        ...bookWithoutAuthorId,
        categories: book.categories.map((bc) => bc.category),
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        throw new ServiceError(400, "Uma ou mais categorias são inválidas");
      }

      throw error;
    }
  }

  async getAllBooks(): Promise<BookResponse[]> {
    const books = await prisma.book.findMany({
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
    });

    return books.map((book) => {
      const { authorId, ...bookWithoutAuthorId } = book;

      return {
        ...bookWithoutAuthorId,
        categories: book.categories.map((bc) => bc.category),
      };
    });
  }

  async getBookById(id: number): Promise<BookResponse | null> {
    const book = await prisma.book.findUnique({
      where: { id },
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
    });

    if (!book) return null;

    const { authorId, ...bookWithoutAuthorId } = book;

    return {
      ...bookWithoutAuthorId,
      categories: book.categories.map((bc) => bc.category),
    };
  }

  async updateBook(
    id: number,
    data: BookUpdateDTO,
  ): Promise<BookResponse | null> {
    const { categoryIds, ...bookData } = data;

    const updateData: any = { ...bookData };

    if (categoryIds !== undefined) {
      const validCategoryIds = await this.validateCategoryIds(categoryIds);

      updateData.categories = {
        deleteMany: {},
        create: validCategoryIds.map((categoryId) => ({
          categoryId,
        })),
      };
    }

    const book = await prisma.book.update({
      where: { id },
      data: updateData,
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
    });

    const { authorId, ...bookWithoutAuthorId } = book;

    return {
      ...bookWithoutAuthorId,
      categories: book.categories.map((bc) => bc.category),
    };
  }

  async deleteBook(id: number): Promise<BookResponse | null> {
    const book = await prisma.book.delete({
      where: { id },
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
    });

    const { authorId, ...bookWithoutAuthorId } = book;

    return {
      ...bookWithoutAuthorId,
      categories: book.categories.map((bc) => bc.category),
    };
  }
}
