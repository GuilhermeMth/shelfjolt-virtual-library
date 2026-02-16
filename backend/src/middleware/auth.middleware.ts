import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { UserResponse } from "../@types/user.types";

const { TokenExpiredError } = jwt;

export class AuthMiddleware {
  private readonly jwt_secret = process.env.JWT_SECRET!;

  public handle = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Formato do token inválido" });
    }

    try {
      const decoded = jwt.verify(token, this.jwt_secret) as UserResponse;

      req.user = decoded;

      return next();
    } catch (e: any) {
      if (e instanceof TokenExpiredError) {
        return res.status(401).json({ error: "Token expirado" });
      }
      return res.status(401).json({ error: "Token inválido" });
    }
  };
}
