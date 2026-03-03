import { Prisma } from "../../generated/prisma/client";
import prisma from "../prisma/prisma";
import type {
  CategoryCreateDTO,
  CategoryUpdateDTO,
  CategoryResponse,
} from "../@types/category.types";

export class CategoryService {
  async createCategory(data: CategoryCreateDTO): Promise<CategoryResponse> {
    try {
      const category = await prisma.category.create({
        data: { name: data.name.trim() },
        select: {
          id: true,
          name: true,
        },
      });

      return category;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("CATEGORY_ALREADY_EXISTS");
      }

      throw error;
    }
  }

  async findAllCategories(): Promise<CategoryResponse[]> {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async updateCategory(
    id: number,
    data: CategoryUpdateDTO,
  ): Promise<CategoryResponse> {
    try {
      return await prisma.category.update({
        where: { id },
        data: {
          name: data.name.trim(),
        },
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("CATEGORY_NOT_FOUND");
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("CATEGORY_ALREADY_EXISTS");
      }

      throw error;
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("CATEGORY_NOT_FOUND");
      }

      throw error;
    }
  }
}
