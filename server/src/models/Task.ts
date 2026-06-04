import { z } from "zod";

// ── Core Task Interface ──────────────────────────────────────────────
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  order: number;
}

// ── Zod Schemas for Validation ───────────────────────────────────────

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .trim()
    .optional()
    .default(""),
  dueDate: z
    .string()
    .datetime({ offset: true, message: "Invalid date format" })
    .nullable()
    .optional()
    .default(null),
});

export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .trim()
    .optional(),
  dueDate: z
    .string()
    .datetime({ offset: true, message: "Invalid date format" })
    .nullable()
    .optional(),
  completed: z.boolean().optional(),
});

export const ReorderSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1, "At least one ID is required"),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type ReorderInput = z.infer<typeof ReorderSchema>;
