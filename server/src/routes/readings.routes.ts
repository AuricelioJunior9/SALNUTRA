import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth";
import { getLatestReadings, getReadingHistory } from "../services/readings.service";

const router = Router();

router.use(authenticate);

router.get("/latest", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const readings = await getLatestReadings();
    res.json(readings);
  } catch (err) {
    next(err);
  }
});

router.get("/history/:variableId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const history = await getReadingHistory(req.params.variableId, limit);
    res.json(history);
  } catch (err) {
    next(err);
  }
});

export default router;
