import { Router } from "express";
import { requireAdminKey } from "../middleware/admin.middleware";
import { writeLimiter } from "../middleware/rateLimit.middleware";
import { userProvider } from "../providers/user.provider";

const router = Router();

// Todas as rotas de usuário são administrativas (acesso via x-admin-key)
router.get("/", requireAdminKey, userProvider.list);
router.get("/:id", requireAdminKey, userProvider.findOne);
router.post("/", requireAdminKey, writeLimiter, userProvider.create);
router.put("/:id", requireAdminKey, writeLimiter, userProvider.update);
router.delete("/:id", requireAdminKey, writeLimiter, userProvider.delete);

export default router;
