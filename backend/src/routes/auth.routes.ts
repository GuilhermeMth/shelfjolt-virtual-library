import { Router } from "express";
import { authProvider } from "../providers/auth.provider";

const authRouter = Router();

authRouter.post("/register", authProvider.register);
authRouter.post("/login", authProvider.login);

export default authRouter;
