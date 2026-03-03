import { CategoryController } from "../controllers/category.controller";
import { CategoryService } from "../services/category.service";

const categoryService = new CategoryService();
export const categoryProvider = new CategoryController(categoryService);
