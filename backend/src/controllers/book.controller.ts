import type { Request, Response } from "express";
import { BookService, ServiceError } from "../services/book.service";
import { fileService } from "../services/file.service";
import { FilePreviewService } from "../services/filePreview.service";
import { viewTracker } from "../services/viewTracker.service";
import type { BookCreateDTO, BookUpdateDTO } from "../@types/book.types";
import { createBookSchema, updateBookSchema } from "../validators/book.schema";
import { catalogQuerySchema } from "../validators/catalog.schema";
import { paginationQuerySchema } from "../validators/pagination.schema";

export class BookController {
  constructor(private readonly bookService: BookService) {
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.uploadCover = this.uploadCover.bind(this);
    this.updateCover = this.updateCover.bind(this);
    this.previewUrl = this.previewUrl.bind(this);
    this.preview = this.preview.bind(this);
    this.catalog = this.catalog.bind(this);
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

      const categoryIdsInput = req.body?.categoryIds;

      let normalizedCategoryIds: unknown = categoryIdsInput;

      if (typeof categoryIdsInput === "string") {
        const trimmed = categoryIdsInput.trim();

        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            normalizedCategoryIds = JSON.parse(trimmed);
          } catch {
            normalizedCategoryIds = trimmed;
          }
        } else if (trimmed.length > 0) {
          normalizedCategoryIds = trimmed
            .split(",")
            .map((value) => Number(value.trim()));
        }
      }

      if (Array.isArray(normalizedCategoryIds)) {
        normalizedCategoryIds = normalizedCategoryIds.map((value) =>
          typeof value === "number" ? value : Number(value),
        );
      }

      const payload: Record<string, unknown> = {
        ...req.body,
        categoryIds: normalizedCategoryIds,
      };

      if (req.file) {
        payload.coverPath = fileService.getCoverUrl(req.file.filename);
      }

      const parsed = createBookSchema.safeParse(payload);
      if (!parsed.success) {
        if (req.file) {
          await fileService.deleteCoverFile(req.file.filename);
        }

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
      if (req.file) {
        await fileService.deleteCoverFile(req.file.filename);
      }

      return this.handleError(res, error, 400, "Dados inválidos");
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const parsed = paginationQuerySchema.safeParse(req.query);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Parâmetros de paginação inválidos",
          details: parsed.error.issues.map((issue) => issue.message),
        });
      }

      const { page, limit } = parsed.data;
      const result = await this.bookService.getAllBooks({ page, limit });
      res.json(result);
    } catch (error) {
      this.handleError(res, error, 500, "Erro interno do servidor");
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID de livro inválido" });
      }

      const book = await this.bookService.getBookById(id);
      if (!book) return res.status(404).json({ error: "Livro não encontrado" });

      // Incrementa visualizações apenas se ainda não foi contada nesta sessão
      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      if (!viewTracker.hasViewed(clientIp, id)) {
        viewTracker.markAsViewed(clientIp, id);
        this.bookService.incrementViewCount(id).catch((error) => {
          console.error("Erro ao incrementar visualizações:", error);
        });
      }

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

  async uploadCover(req: Request, res: Response) {
    try {
      const bookId = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        // Clean up uploaded file if auth fails
        if (req.file) {
          await fileService.deleteCoverFile(req.file.filename);
        }
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
      }

      if (Number.isNaN(bookId) || bookId <= 0) {
        await fileService.deleteCoverFile(req.file.filename);
        return res.status(400).json({ error: "ID de livro inválido" });
      }

      // Verify book exists and user is the author
      const existingBook = await this.bookService.getBookById(bookId);
      if (!existingBook) {
        await fileService.deleteCoverFile(req.file.filename);
        return res.status(404).json({ error: "Livro não encontrado" });
      }

      if (existingBook.author.id !== userId) {
        await fileService.deleteCoverFile(req.file.filename);
        return res
          .status(403)
          .json({ error: "Você não tem permissão para atualizar este livro" });
      }

      // Delete old cover if it exists
      if (existingBook.coverPath) {
        await fileService.deleteCoverFile(
          fileService.extractFilenameFromUrl(existingBook.coverPath),
        );
      }

      // Update book with new cover URL
      const coverUrl = fileService.getCoverUrl(req.file.filename);
      const updatedBook = await this.bookService.updateBook(bookId, {
        coverPath: coverUrl,
      });

      res.json({
        message: "Capa do livro atualizada com sucesso",
        coverUrl,
        book: updatedBook,
      });
    } catch (error) {
      if (req.file) {
        await fileService.deleteCoverFile(req.file.filename);
      }
      return this.handleError(res, error, 500, "Erro ao fazer upload da capa");
    }
  }

  async updateCover(req: Request, res: Response) {
    try {
      const bookId = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        if (req.file) {
          await fileService.deleteCoverFile(req.file.filename);
        }
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
      }

      if (Number.isNaN(bookId) || bookId <= 0) {
        await fileService.deleteCoverFile(req.file.filename);
        return res.status(400).json({ error: "ID de livro inválido" });
      }

      const existingBook = await this.bookService.getBookById(bookId);
      if (!existingBook) {
        await fileService.deleteCoverFile(req.file.filename);
        return res.status(404).json({ error: "Livro não encontrado" });
      }

      if (existingBook.author.id !== userId) {
        await fileService.deleteCoverFile(req.file.filename);
        return res
          .status(403)
          .json({ error: "Você não tem permissão para atualizar este livro" });
      }

      // Delete old cover if it exists
      if (existingBook.coverPath) {
        await fileService.deleteCoverFile(
          fileService.extractFilenameFromUrl(existingBook.coverPath),
        );
      }

      // Update book with new cover URL
      const coverUrl = fileService.getCoverUrl(req.file.filename);
      const updatedBook = await this.bookService.updateBook(bookId, {
        coverPath: coverUrl,
      });

      res.json({
        message: "Capa do livro atualizada com sucesso",
        coverUrl,
        book: updatedBook,
      });
    } catch (error) {
      if (req.file) {
        await fileService.deleteCoverFile(req.file.filename);
      }
      return this.handleError(res, error, 500, "Erro ao atualizar capa");
    }
  }

  async previewUrl(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID de livro inválido" });
      }

      const book = await this.bookService.getBookById(id);
      if (!book) {
        return res.status(404).json({ error: "Livro não encontrado" });
      }

      // Incrementa visualizações apenas se ainda não foi contada nesta sessão
      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      if (!viewTracker.hasViewed(clientIp, id)) {
        viewTracker.markAsViewed(clientIp, id);
        this.bookService.incrementViewCount(id).catch((error) => {
          console.error("Erro ao incrementar visualizações:", error);
        });
      }

      const preview = FilePreviewService.convertToPreviewUrl(book.fileUrl);

      return res.json({
        bookId: book.id,
        fileUrl: book.fileUrl,
        embedUrl: preview.embedUrl,
        provider: preview.type,
        isSupported: preview.isSupported,
      });
    } catch (error) {
      this.handleError(res, error, 500, "Erro ao carregar preview");
    }
  }

  async preview(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID de livro inválido" });
      }

      const book = await this.bookService.getBookById(id);
      if (!book) {
        return res.status(404).json({ error: "Livro não encontrado" });
      }

      // Incrementa visualizações apenas se ainda não foi contada nesta sessão
      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      if (!viewTracker.hasViewed(clientIp, id)) {
        viewTracker.markAsViewed(clientIp, id);
        this.bookService.incrementViewCount(id).catch((error) => {
          console.error("Erro ao incrementar visualizações:", error);
        });
      }

      // Converte fileUrl para preview URL e gera HTML
      const embedHtml = FilePreviewService.getEmbedHtml(book.fileUrl);

      // HTML da página de preview
      const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${book.title} - ShelfJolt</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
              background: #f5f5f5;
              padding: 16px;
            }
            
            .container {
              max-width: 1200px;
              margin: 0 auto;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .header {
              display: flex;
              align-items: center;
              gap: 24px;
              padding: 24px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            
            .cover {
              width: 120px;
              height: 180px;
              background: rgba(255,255,255,0.1);
              border-radius: 4px;
              overflow: hidden;
              flex-shrink: 0;
            }
            
            .cover img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .book-info h1 {
              margin-bottom: 8px;
              font-size: 24px;
            }
            
            .book-info p {
              opacity: 0.9;
              margin-bottom: 4px;
            }
            
            .content {
              padding: 32px 24px;
            }
            
            .back-button {
              display: inline-block;
              margin-bottom: 24px;
              padding: 8px 16px;
              background: #f0f0f0;
              color: #333;
              text-decoration: none;
              border-radius: 4px;
              transition: background 0.2s;
            }
            
            .back-button:hover {
              background: #e0e0e0;
            }
            
            .preview-container {
              margin-top: 24px;
              padding: 16px;
              background: #fafafa;
              border-radius: 4px;
              border: 1px solid #e0e0e0;
            }
            
            .description {
              margin: 24px 0;
              color: #666;
              line-height: 1.6;
            }
            
            .meta {
              display: flex;
              gap: 32px;
              margin: 24px 0;
              padding-bottom: 24px;
              border-bottom: 1px solid #e0e0e0;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              ${
                book.coverPath
                  ? `<div class="cover"><img src="${book.coverPath}" alt="${book.title}"></div>`
                  : '<div class="cover" style="background: #ddd;"></div>'
              }
              <div class="book-info">
                <h1>${book.title}</h1>
                <p><strong>Autor:</strong> ${book.author.name}</p>
                <p><strong>Idioma:</strong> ${book.language}</p>
                <p><strong>Publicado:</strong> ${new Date(book.published).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
            
            <div class="content">
              <a href="javascript:history.back()" class="back-button">← Voltar</a>
              
              ${book.description ? `<div class="description">${book.description}</div>` : ""}
              
              <div class="meta">
                <div><strong>${book.viewCount}</strong> visualizações</div>
              </div>
              
              <div class="preview-container">
                ${embedHtml}
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } catch (error) {
      this.handleError(res, error, 500, "Erro ao carregar preview");
    }
  }

  async catalog(req: Request, res: Response) {
    try {
      const parsed = catalogQuerySchema.safeParse(req.query);

      if (!parsed.success) {
        return res.status(400).json({
          error: "Parâmetros de busca inválidos",
          details: parsed.error.issues.map((issue) => issue.message),
        });
      }

      const { search, categories, language, page, limit, sortBy } = parsed.data;

      const result = await this.bookService.getCatalog({
        ...(search && { search }),
        ...(categories && { categories }),
        ...(language && { language }),
        page,
        limit,
        sortBy,
      });

      res.json(result);
    } catch (error) {
      this.handleError(res, error, 500, "Erro ao buscar catálogo");
    }
  }
}
