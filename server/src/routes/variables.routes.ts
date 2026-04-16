import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { getAllVariables, updateVariable } from "../services/variables.service";

const router = Router();

router.use(authenticate);

const updateVariableSchema = z.object({
  name: z.string().min(1).optional(),
  unit: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  warning_min: z.number().optional(),
  warning_max: z.number().optional(),
  icon: z.string().optional(),
}).refine((data) => {
  if (data.min !== undefined && data.max !== undefined) {
    return data.min < data.max;
  }
  return true;
}, { message: "min deve ser menor que max." })
  .refine((data) => {
    if (data.warning_min !== undefined && data.warning_max !== undefined) {
      return data.warning_min < data.warning_max;
    }
    return true;
  }, { message: "warning_min deve ser menor que warning_max." });

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const variables = await getAllVariables();
    res.json(variables);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireRole("operador"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = updateVariableSchema.parse(req.body);
    const updated = await updateVariable(req.params.id, dto);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
