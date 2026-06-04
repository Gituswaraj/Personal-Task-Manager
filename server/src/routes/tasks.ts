import { Router, Request, Response, NextFunction } from "express";
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  ReorderSchema,
} from "../models/Task";
import { validateRequest } from "../middleware/validateRequest";
import { AppError } from "../middleware/errorHandler";
import * as taskService from "../services/taskService";

const router = Router();

// ── GET /api/tasks — Get all tasks ───────────────────────────────────
router.get("/", (_req: Request, res: Response) => {
  const tasks = taskService.getAllTasks();
  res.json(tasks);
});

// ── GET /api/tasks/:id — Get a single task ───────────────────────────
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  const task = taskService.getTaskById(req.params.id as string);
  if (!task) {
    return next(new AppError(404, "Task not found"));
  }
  res.json(task);
});

// ── POST /api/tasks — Create a new task ──────────────────────────────
router.post(
  "/",
  validateRequest(CreateTaskSchema),
  (req: Request, res: Response) => {
    const task = taskService.createTask(req.body);
    res.status(201).json(task);
  }
);

// ── PATCH /api/tasks/reorder — Reorder tasks ─────────────────────────
// NOTE: This route must be defined BEFORE /:id to avoid conflict
router.patch(
  "/reorder",
  validateRequest(ReorderSchema),
  (req: Request, res: Response) => {
    const tasks = taskService.reorderTasks(req.body.orderedIds);
    res.json(tasks);
  }
);

// ── PATCH /api/tasks/:id — Update a task ─────────────────────────────
router.patch(
  "/:id",
  validateRequest(UpdateTaskSchema),
  (req: Request, res: Response, next: NextFunction) => {
    const task = taskService.updateTask(req.params.id as string, req.body);
    if (!task) {
      return next(new AppError(404, "Task not found"));
    }
    res.json(task);
  }
);

// ── DELETE /api/tasks/:id — Delete a task ────────────────────────────
router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  const deleted = taskService.deleteTask(req.params.id as string);
  if (!deleted) {
    return next(new AppError(404, "Task not found"));
  }
  res.json({ message: "Task deleted successfully" });
});

export default router;
