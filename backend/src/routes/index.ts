import { Router } from "express";
import authRouter from "./auth.routes";
import bookRouter from "./book.routes";
import categoryRouter from "./category.routes";
import userRouter from "./user.routes";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get("/status", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

router.get("/protected", protect, (req, res) => {
  res.json({ message: "Acesso autorizado!", user: req.user });
});

router.use("/auth", authRouter);
router.use("/books", bookRouter);
router.use("/categories", categoryRouter);
router.use("/users", userRouter);

export default router;
