import { Router } from "express";
import { bookProvider } from "../providers/book.provider";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, bookProvider.create);
router.get("/", bookProvider.findAll);
router.get("/:id", bookProvider.findOne);
router.put("/:id", protect, bookProvider.update);
router.delete("/:id", protect, bookProvider.delete);
export default router;
