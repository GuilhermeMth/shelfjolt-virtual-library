import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { registerSchema, loginSchema } from "../validators/auth.schema";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public register = async (req: Request, res: Response) => {
    try {
      const parse = registerSchema.safeParse(req.body);
      if (!parse.success) {
        return res
          .status(400)
          .json({
            error: parse.error.issues
              .map((e: { message: string }) => e.message)
              .join(", "),
          });
      }
      const result = await this.authService.register(parse.data);
      return res.status(201).json(result);
    } catch (e: any) {
      if (e.message === "USER_ALREADY_EXISTS") {
        return res.status(400).json({ error: "E-mail já cadastrado" });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const parse = loginSchema.safeParse(req.body);
      if (!parse.success) {
        return res
          .status(400)
          .json({
            error: parse.error.issues
              .map((e: { message: string }) => e.message)
              .join(", "),
          });
      }
      const result = await this.authService.login(parse.data);
      return res.status(200).json(result);
    } catch (e: any) {
      if (e.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({ error: "E-mail ou senha inválidos" });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  public loginWithFirebaseToken = async (req: Request, res: Response) => {
    try {
      const { firebaseToken } = req.body;
      const result =
        await this.authService.authenticateWithFirebaseToken(firebaseToken);
      return res.status(200).json(result);
    } catch (e: any) {
      if (
        e.message === "INVALID_FIREBASE_TOKEN" ||
        e.message === "INVALID_FIREBASE_PAYLOAD"
      ) {
        return res.status(401).json({ error: "Token do Firebase inválido" });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
