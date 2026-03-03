import { Router } from "express";
import { categoryProvider } from "../providers/category.provider";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, categoryProvider.create);
router.get("/", categoryProvider.findAll);
router.put("/:id", protect, categoryProvider.update);
router.delete("/:id", protect, categoryProvider.delete);

export default router;
