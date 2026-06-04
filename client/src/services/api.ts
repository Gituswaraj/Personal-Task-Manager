import type { Task, TaskFormData } from "../types";
import { fromDateInputValue } from "../utils/dateUtils";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Generic Fetch Wrapper ────────────────────────────────────────────
async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({
      error: { message: "An unexpected error occurred" },
    }));
    throw new Error(errorBody.error?.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ── API Methods ──────────────────────────────────────────────────────

export async function fetchTasks(): Promise<Task[]> {
  return request<Task[]>("/api/tasks");
}

export async function createTask(data: TaskFormData): Promise<Task> {
  return request<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify({
      title: data.title.trim(),
      description: data.description.trim(),
      dueDate: fromDateInputValue(data.dueDate),
    }),
  });
}

export async function updateTask(
  id: string,
  data: Partial<TaskFormData & { completed: boolean }>
): Promise<Task> {
  const body: Record<string, unknown> = {};

  if (data.title !== undefined) body.title = data.title.trim();
  if (data.description !== undefined) body.description = data.description.trim();
  if (data.dueDate !== undefined) body.dueDate = fromDateInputValue(data.dueDate);
  if (data.completed !== undefined) body.completed = data.completed;

  return request<Task>(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteTask(
  id: string
): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/tasks/${id}`, {
    method: "DELETE",
  });
}

export async function reorderTasks(orderedIds: string[]): Promise<Task[]> {
  return request<Task[]>("/api/tasks/reorder", {
    method: "PATCH",
    body: JSON.stringify({ orderedIds }),
  });
}
