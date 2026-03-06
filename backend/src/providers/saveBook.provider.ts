import { SaveBookController } from "../controllers/saveBook.controller";
import { SaveBookService } from "../services/saveBook.service";

const saveBookService = new SaveBookService();
export const saveBookProvider = new SaveBookController(saveBookService);
