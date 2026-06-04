// ── Task Interface ────────────────────────────────────────────────────
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

// ── Form Data for Creating / Editing ─────────────────────────────────
export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
}

// ── Filter Status ────────────────────────────────────────────────────
export type FilterStatus = "all" | "active" | "completed";

// ── API Error Shape ──────────────────────────────────────────────────
export interface ApiError {
  error: {
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}
