import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { login, getUserById } from "../services/auth.service";
import { authenticate } from "../middleware/auth";

const router = Router();

const loginSchema = z.object({
  email: z.string().email("Email invalido."),
  password: z.string().min(1, "Senha obrigatoria."),
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/me", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserById(req.user!.sub);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
