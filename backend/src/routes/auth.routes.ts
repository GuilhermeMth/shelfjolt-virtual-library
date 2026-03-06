import { Router } from "express";
import { authProvider } from "../providers/auth.provider";
import { authLimiter } from "../middleware/rateLimit.middleware";

const authRouter = Router();

authRouter.post("/register", authLimiter, authProvider.register);
authRouter.post("/login", authLimiter, authProvider.login);
authRouter.post(
  "/login/firebase",
  authLimiter,
  authProvider.loginWithFirebaseToken,
);

export default authRouter;
