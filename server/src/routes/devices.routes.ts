import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import {
  getAllDevices,
  createDevice,
  updateDevice,
  deleteDevice,
} from "../services/devices.service";

const router = Router();

router.use(authenticate);

const deviceStatusEnum = z.enum(["online", "offline"]);

const createDeviceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  status: deviceStatusEnum,
  ip: z.string().ip({ version: "v4", message: "IP invalido." }),
});

const updateDeviceSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  status: deviceStatusEnum.optional(),
  ip: z.string().ip({ version: "v4", message: "IP invalido." }).optional(),
});

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const devices = await getAllDevices();
    res.json(devices);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = createDeviceSchema.parse(req.body);
    const device = await createDevice(dto);
    res.status(201).json(device);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = updateDeviceSchema.parse(req.body);
    const device = await updateDevice(req.params.id, dto);
    res.json(device);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireRole("admin"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteDevice(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
