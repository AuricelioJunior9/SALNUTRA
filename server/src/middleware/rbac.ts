import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types";

const ROLE_LEVEL: Record<UserRole, number> = {
  admin: 3,
  operador: 2,
  usuario: 1,
};

export function requireRole(minRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Nao autenticado." });
      return;
    }

    if (ROLE_LEVEL[user.role] < ROLE_LEVEL[minRole]) {
      res.status(403).json({
        error: `Acesso negado. Requer perfil: ${minRole} ou superior.`,
      });
      return;
    }

    next();
  };
}
