import type { NextFunction, Request, Response } from "express";

export const requireAdminKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    return res.status(500).json({
      error: "ADMIN_API_KEY não configurada no ambiente",
    });
  }

  const providedKey = req.header("x-admin-key");

  if (!providedKey) {
    return res.status(401).json({
      error: "Header x-admin-key é obrigatório",
    });
  }

  if (providedKey !== adminKey) {
    return res.status(403).json({ error: "Acesso administrativo negado" });
  }

  return next();
};
