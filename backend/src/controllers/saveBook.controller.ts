import type { Request, Response } from "express";
import { SaveBookService } from "../services/saveBook.service";
import { savedBooksQuerySchema } from "../validators/savedBooks.schema";

export class SaveBookController {
  constructor(private readonly saveBookService: SaveBookService) {
    this.save = this.save.bind(this);
    this.unsave = this.unsave.bind(this);
    this.getSaved = this.getSaved.bind(this);
    this.checkSaved = this.checkSaved.bind(this);
  }

  private handleError(
    res: Response,
    error: unknown,
    fallbackStatus: number,
    fallbackMessage: string,
  ) {
    if (error instanceof Error) {
      return res.status(fallbackStatus).json({ error: error.message });
    }

    return res.status(fallbackStatus).json({ error: fallbackMessage });
  }

  async save(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const bookId = Number(req.params.id);

      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      if (Number.isNaN(bookId) || bookId <= 0) {
        return res.status(400).json({ error: "ID de livro inválido" });
      }

      const result = await this.saveBookService.saveBook(userId, bookId);
      res.status(201).json(result);
    } catch (error) {
      this.handleError(res, error, 400, "Erro ao salvar livro");
    }
  }

  async unsave(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const bookId = Number(req.params.id);

      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      if (Number.isNaN(bookId) || bookId <= 0) {
        return res.status(400).json({ error: "ID de livro inválido" });
      }

      const result = await this.saveBookService.unsaveBook(userId, bookId);
      res.json(result);
    } catch (error) {
      this.handleError(res, error, 400, "Erro ao remover livro da estante");
    }
  }

  async getSaved(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const parsed = savedBooksQuerySchema.safeParse(req.query);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Parâmetros de busca inválidos",
          details: parsed.error.issues.map((issue) => issue.message),
        });
      }

      const { search, categories, language, page, limit, sortBy } = parsed.data;

      const result = await this.saveBookService.getSavedBooks(userId, {
        page,
        limit,
        ...(search && { search }),
        ...(categories && { categories }),
        ...(language && { language }),
        sortBy,
      });

      res.json(result);
    } catch (error) {
      this.handleError(res, error, 500, "Erro ao buscar livros salvos");
    }
  }

  async checkSaved(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const bookId = Number(req.params.id);

      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      if (Number.isNaN(bookId) || bookId <= 0) {
        return res.status(400).json({ error: "ID de livro inválido" });
      }

      const isSaved = await this.saveBookService.isBookSaved(userId, bookId);
      res.json({ isSaved });
    } catch (error) {
      this.handleError(res, error, 500, "Erro ao verificar livro");
    }
  }
}
