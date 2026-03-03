import type { Request, Response } from "express";
import { BookService, ServiceError } from "../services/book.service";
import type { BookCreateDTO, BookUpdateDTO } from "../@types/book.types";
import { createBookSchema, updateBookSchema } from "../validators/book.schema";

export class BookController {
  constructor(private readonly bookService: BookService) {
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  private handleError(
    res: Response,
    error: unknown,
    fallbackStatus: number,
    fallbackMessage: string,
  ) {
    if (error instanceof ServiceError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(fallbackStatus).json({ error: fallbackMessage });
  }

  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const parsed = createBookSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.issues.map((issue) => issue.message).join(", "),
        });
      }

      const bookData: BookCreateDTO = {
        title: parsed.data.title,
        slug: parsed.data.slug,
        fileUrl: parsed.data.fileUrl,
        language: parsed.data.language,
        categoryIds: parsed.data.categoryIds,
        authorId: userId,
        ...(parsed.data.description !== undefined
          ? { description: parsed.data.description }
          : {}),
        ...(parsed.data.coverPath !== undefined
          ? { coverPath: parsed.data.coverPath }
          : {}),
      };

      const book = await this.bookService.createBook(bookData);
      res.status(201).json(book);
    } catch (error) {
      return this.handleError(res, error, 400, "Dados inválidos");
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const books = await this.bookService.getAllBooks();
      res.json(books);
    } catch (error) {
      this.handleError(res, error, 500, "Erro interno do servidor");
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const book = await this.bookService.getBookById(id);
      if (!book) return res.status(404).json({ error: "Book not found" });
      res.json(book);
    } catch (error) {
      this.handleError(res, error, 500, "Erro interno do servidor");
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const userId = req.user?.id;

      if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID de livro inválido" });
      }

      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const parsed = updateBookSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.issues.map((issue) => issue.message).join(", "),
        });
      }

      const existingBook = await this.bookService.getBookById(id);
      if (!existingBook) {
        return res.status(404).json({ error: "Livro não encontrado" });
      }

      if (existingBook.author.id !== userId) {
        return res
          .status(403)
          .json({ error: "Você não tem permissão para editar este livro" });
      }

      const updateData: BookUpdateDTO = {
        ...(parsed.data.title !== undefined
          ? { title: parsed.data.title }
          : {}),
        ...(parsed.data.slug !== undefined ? { slug: parsed.data.slug } : {}),
        ...(parsed.data.fileUrl !== undefined
          ? { fileUrl: parsed.data.fileUrl }
          : {}),
        ...(parsed.data.language !== undefined
          ? { language: parsed.data.language }
          : {}),
        ...(parsed.data.categoryIds !== undefined
          ? { categoryIds: parsed.data.categoryIds }
          : {}),
        ...(parsed.data.description !== undefined
          ? { description: parsed.data.description }
          : {}),
        ...(parsed.data.coverPath !== undefined
          ? { coverPath: parsed.data.coverPath }
          : {}),
      };

      const book = await this.bookService.updateBook(id, updateData);
      res.json(book);
    } catch (error) {
      this.handleError(res, error, 400, "Dados inválidos");
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const existingBook = await this.bookService.getBookById(id);
      if (!existingBook) {
        return res.status(404).json({ error: "Livro não encontrado" });
      }

      if (existingBook.author.id !== userId) {
        return res
          .status(403)
          .json({ error: "Você não tem permissão para deletar este livro" });
      }

      const book = await this.bookService.deleteBook(id);
      res.json({ message: "Livro deletado com sucesso", book });
    } catch (error) {
      this.handleError(res, error, 500, "Erro interno do servidor");
    }
  }
}
