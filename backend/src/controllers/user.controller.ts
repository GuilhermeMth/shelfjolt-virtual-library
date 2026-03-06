import type { Request, Response } from "express";
import { UserService } from "../services/user.service";
import {
  createUserSchema,
  updateUserSchema,
  usersQuerySchema,
} from "../validators/user.schema";

export class UserController {
  constructor(private readonly userService: UserService) {
    this.list = this.list.bind(this);
    this.findOne = this.findOne.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async list(req: Request, res: Response) {
    try {
      const parsed = usersQuerySchema.safeParse(req.query);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Parâmetros de busca inválidos",
          details: parsed.error.issues.map((issue) => issue.message),
        });
      }

      const { page, limit, search } = parsed.data;
      const result = await this.userService.listUsers({
        page,
        limit,
        ...(search && { search }),
      });

      return res.status(200).json(result);
    } catch {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID de usuário inválido" });
      }

      const user = await this.userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.status(200).json(user);
    } catch {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const parsed = createUserSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.issues.map((issue) => issue.message).join(", "),
        });
      }

      const user = await this.userService.createUser(parsed.data);
      return res.status(201).json(user);
    } catch (error) {
      if ((error as Error).message === "USER_ALREADY_EXISTS") {
        return res.status(409).json({ error: "E-mail já cadastrado" });
      }

      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID de usuário inválido" });
      }

      const parsed = updateUserSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.issues.map((issue) => issue.message).join(", "),
        });
      }

      const user = await this.userService.updateUser(id, parsed.data);
      return res.status(200).json(user);
    } catch (error) {
      if ((error as Error).message === "USER_NOT_FOUND") {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      if ((error as Error).message === "USER_ALREADY_EXISTS") {
        return res.status(409).json({ error: "E-mail já cadastrado" });
      }

      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID de usuário inválido" });
      }

      await this.userService.deleteUser(id);
      return res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      if ((error as Error).message === "USER_NOT_FOUND") {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
