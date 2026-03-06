import { Router } from "express";
import { categoryProvider } from "../providers/category.provider";
import { protect } from "../middleware/auth.middleware";
import { writeLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/", protect, writeLimiter, categoryProvider.create);
router.get("/", categoryProvider.findAll);
router.put("/:id", protect, writeLimiter, categoryProvider.update);
router.delete("/:id", protect, writeLimiter, categoryProvider.delete);

export default router;
