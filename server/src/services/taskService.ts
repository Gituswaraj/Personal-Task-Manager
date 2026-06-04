import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Task, CreateTaskInput, UpdateTaskInput } from "../models/Task";

// ── File Path ────────────────────────────────────────────────────────
const DATA_FILE = path.join(__dirname, "..", "data", "tasks.json");

// ── Helpers: Read & Write ────────────────────────────────────────────
function readTasks(): Task[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      // Ensure the data directory exists
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, "[]", "utf-8");
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

function writeTasks(tasks: Task[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

// ── Seed Data ────────────────────────────────────────────────────────
function seedIfEmpty(): void {
  const tasks = readTasks();
  if (tasks.length > 0) return;

  const now = new Date();
  const seedTasks: Task[] = [
    {
      id: uuidv4(),
      title: "Review project requirements",
      description:
        "Go through the project brief and make a checklist of all functional requirements.",
      dueDate: new Date(
        now.getTime() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      completed: true,
      createdAt: new Date(
        now.getTime() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      order: 0,
    },
    {
      id: uuidv4(),
      title: "Set up development environment",
      description:
        "Install Node.js, initialize the project, and configure TypeScript.",
      dueDate: new Date(
        now.getTime() + 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      completed: false,
      createdAt: new Date(
        now.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      order: 1,
    },
    {
      id: uuidv4(),
      title: "Design the database schema",
      description: "Define the task model with all required fields.",
      dueDate: new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(), // Overdue!
      completed: false,
      createdAt: new Date(
        now.getTime() - 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
      order: 2,
    },
    {
      id: uuidv4(),
      title: "Write API documentation",
      description: "",
      dueDate: null,
      completed: false,
      createdAt: new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        now.getTime() - 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      order: 3,
    },
  ];

  writeTasks(seedTasks);
}

// ── Service Methods ──────────────────────────────────────────────────

/**
 * Get all tasks, sorted by creation date (newest first).
 */
export function getAllTasks(): Task[] {
  const tasks = readTasks();
  return tasks.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get a single task by ID.
 */
export function getTaskById(id: string): Task | undefined {
  const tasks = readTasks();
  return tasks.find((t) => t.id === id);
}

/**
 * Create a new task.
 */
export function createTask(input: CreateTaskInput): Task {
  const tasks = readTasks();
  const now = new Date().toISOString();

  const newTask: Task = {
    id: uuidv4(),
    title: input.title,
    description: input.description ?? "",
    dueDate: input.dueDate ?? null,
    completed: false,
    createdAt: now,
    updatedAt: now,
    order: tasks.length,
  };

  tasks.push(newTask);
  writeTasks(tasks);
  return newTask;
}

/**
 * Update an existing task. Returns the updated task or undefined if not found.
 */
export function updateTask(
  id: string,
  input: UpdateTaskInput
): Task | undefined {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) return undefined;

  const existing = tasks[index];
  const updated: Task = {
    ...existing,
    title: input.title ?? existing.title,
    description: input.description ?? existing.description,
    dueDate: input.dueDate !== undefined ? input.dueDate : existing.dueDate,
    completed: input.completed !== undefined ? input.completed : existing.completed,
    updatedAt: new Date().toISOString(),
  };

  tasks[index] = updated;
  writeTasks(tasks);
  return updated;
}

/**
 * Delete a task by ID. Returns true if deleted, false if not found.
 */
export function deleteTask(id: string): boolean {
  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) return false;

  tasks.splice(index, 1);
  writeTasks(tasks);
  return true;
}

/**
 * Reorder tasks based on an ordered array of IDs.
 */
export function reorderTasks(orderedIds: string[]): Task[] {
  const tasks = readTasks();

  // Update order for each task based on its position in orderedIds
  orderedIds.forEach((id, index) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.order = index;
      task.updatedAt = new Date().toISOString();
    }
  });

  writeTasks(tasks);
  return tasks.sort((a, b) => a.order - b.order);
}

// Run seed on import
seedIfEmpty();
