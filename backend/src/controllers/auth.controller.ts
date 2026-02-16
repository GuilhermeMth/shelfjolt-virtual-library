import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public register = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.register(req.body);
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
      const result = await this.authService.login(req.body);
      return res.status(200).json(result);
    } catch (e: any) {
      if (e.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({ error: "E-mail ou senha inválidos" });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
