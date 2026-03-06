import { Router } from "express";
import { bookProvider } from "../providers/book.provider";
import { saveBookProvider } from "../providers/saveBook.provider";
import { protect } from "../middleware/auth.middleware";
import { uploadCover } from "../middleware/upload.middleware";
import { viewLimiter, writeLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

// Catalog route - must be before /:id to avoid conflicts
router.get("/catalog", bookProvider.catalog);

// Saved books routes
router.get("/saved", protect, saveBookProvider.getSaved);

// Public routes
router.get("/", bookProvider.findAll);
router.get("/:id/preview-url", viewLimiter, bookProvider.previewUrl);
router.get("/:id", viewLimiter, bookProvider.findOne);
router.get("/:id/preview", viewLimiter, bookProvider.preview);

// Save/Unsave book routes
router.post("/:id/save", protect, saveBookProvider.save);
router.delete("/:id/save", protect, saveBookProvider.unsave);
router.get("/:id/saved", protect, saveBookProvider.checkSaved);

// Protected routes - my books
router.post(
  "/",
  protect,
  writeLimiter,
  uploadCover.single("cover"),
  bookProvider.create,
);
router.put("/me/:id", protect, writeLimiter, bookProvider.update);
router.post(
  "/me/:id/cover",
  protect,
  writeLimiter,
  uploadCover.single("cover"),
  bookProvider.uploadCover,
);
router.put(
  "/me/:id/cover",
  protect,
  writeLimiter,
  uploadCover.single("cover"),
  bookProvider.updateCover,
);
router.delete("/me/:id", protect, writeLimiter, bookProvider.delete);

export default router;
