import type { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.schema";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const parsed = createCategorySchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.issues.map((issue) => issue.message).join(", "),
        });
      }

      const category = await this.categoryService.createCategory(parsed.data);
      return res.status(201).json(category);
    } catch (error) {
      if ((error as Error).message === "CATEGORY_ALREADY_EXISTS") {
        return res.status(409).json({ error: "Categoria já existe" });
      }

      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const categories = await this.categoryService.findAllCategories();
      return res.status(200).json(categories);
    } catch {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID de categoria inválido" });
      }

      const parsed = updateCategorySchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.issues.map((issue) => issue.message).join(", "),
        });
      }

      const category = await this.categoryService.updateCategory(
        id,
        parsed.data,
      );
      return res.status(200).json(category);
    } catch (error) {
      if ((error as Error).message === "CATEGORY_NOT_FOUND") {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      if ((error as Error).message === "CATEGORY_ALREADY_EXISTS") {
        return res.status(409).json({ error: "Categoria já existe" });
      }

      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID de categoria inválido" });
      }

      await this.categoryService.deleteCategory(id);
      return res
        .status(200)
        .json({ message: "Categoria deletada com sucesso" });
    } catch (error) {
      if ((error as Error).message === "CATEGORY_NOT_FOUND") {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
