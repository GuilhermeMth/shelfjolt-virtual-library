import bcrypt from "bcrypt";
import { Prisma } from "../../generated/prisma/client";
import prisma from "../prisma/prisma";
import type { CreateUserDTO, UpdateUserDTO } from "../validators/user.schema";

type SafeUser = {
  id: number;
  name: string;
  email: string;
  google_id: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class UserService {
  private readonly saltRounds = 10;

  async listUsers(options: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{
    users: SafeUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          google_id: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: number): Promise<SafeUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        google_id: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createUser(data: CreateUserDTO): Promise<SafeUser> {
    let hashedPassword: string | null = null;

    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, this.saltRounds);
    }

    try {
      return await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          google_id: data.google_id ?? null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          google_id: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("USER_ALREADY_EXISTS");
      }
      throw error;
    }
  }

  async updateUser(id: number, data: UpdateUserDTO): Promise<SafeUser> {
    const updateData: {
      name?: string;
      email?: string;
      password?: string | null;
      google_id?: string | null;
    } = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.google_id !== undefined) updateData.google_id = data.google_id;

    if (data.password !== undefined) {
      if (data.password === null) {
        updateData.password = null;
      } else {
        updateData.password = await bcrypt.hash(data.password, this.saltRounds);
      }
    }

    try {
      return await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          google_id: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("USER_NOT_FOUND");
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("USER_ALREADY_EXISTS");
      }

      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("USER_NOT_FOUND");
      }
      throw error;
    }
  }
}
