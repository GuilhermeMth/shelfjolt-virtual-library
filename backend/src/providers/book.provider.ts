import { BookService } from "../services/book.service";
import { BookController } from "../controllers/book.controller";

const bookService = new BookService();
export const bookProvider = new BookController(bookService);
