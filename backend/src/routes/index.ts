import { Router } from "express";
import authRouter from "./auth.routes";
import { AuthMiddleware } from "../middleware/auth.middleware";

const router = Router();
const authMiddleware = new AuthMiddleware();

router.get("/status", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

router.get("/protected", authMiddleware.handle, (req, res) => {
  res.json({ message: "Acesso autorizado!", user: req.user });
});

router.use("/auth", authRouter);

export default router;
