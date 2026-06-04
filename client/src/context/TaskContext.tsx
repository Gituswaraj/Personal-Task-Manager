import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Task, TaskFormData, FilterStatus } from "../types";
import * as api from "../services/api";

// ── Toast Type ───────────────────────────────────────────────────────
export interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

// ── Context Shape ────────────────────────────────────────────────────
interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  filter: FilterStatus;
  searchQuery: string;
  activeCount: number;
  completedCount: number;
  toasts: Toast[];
  setFilter: (filter: FilterStatus) => void;
  setSearchQuery: (query: string) => void;
  addTask: (data: TaskFormData) => Promise<void>;
  editTask: (id: string, data: TaskFormData) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  reorderTasks: (orderedIds: string[]) => Promise<void>;
  dismissToast: (id: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────────
let toastCounter = 0;

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Show a toast notification
  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      const id = ++toastCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.fetchTasks();
        setTasks(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load tasks"
        );
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  // ── Actions ────────────────────────────────────────────────────────
  const addTask = useCallback(
    async (data: TaskFormData) => {
      try {
        const newTask = await api.createTask(data);
        setTasks((prev) => [newTask, ...prev]);
        showToast("Task created successfully!", "success");
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Failed to create task",
          "error"
        );
        throw err;
      }
    },
    [showToast]
  );

  const editTask = useCallback(
    async (id: string, data: TaskFormData) => {
      try {
        const updated = await api.updateTask(id, data);
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? updated : t))
        );
        showToast("Task updated successfully!", "success");
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Failed to update task",
          "error"
        );
        throw err;
      }
    },
    [showToast]
  );

  const toggleTask = useCallback(
    async (id: string, completed: boolean) => {
      try {
        const updated = await api.updateTask(id, { completed });
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? updated : t))
        );
        showToast(
          completed ? "Task completed! 🎉" : "Task marked as active",
          "success"
        );
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Failed to toggle task",
          "error"
        );
      }
    },
    [showToast]
  );

  const removeTask = useCallback(
    async (id: string) => {
      try {
        await api.deleteTask(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
        showToast("Task deleted", "success");
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Failed to delete task",
          "error"
        );
      }
    },
    [showToast]
  );

  const reorderTasks = useCallback(
    async (orderedIds: string[]) => {
      // Optimistic reorder locally
      setTasks((prev) => {
        const taskMap = new Map(prev.map((t) => [t.id, t]));
        const reordered: Task[] = [];
        orderedIds.forEach((id) => {
          const task = taskMap.get(id);
          if (task) reordered.push(task);
        });
        // Add any tasks not in orderedIds (shouldn't happen, but safety)
        prev.forEach((t) => {
          if (!orderedIds.includes(t.id)) reordered.push(t);
        });
        return reordered;
      });

      try {
        await api.reorderTasks(orderedIds);
      } catch (err) {
        // Revert on failure — refetch
        const data = await api.fetchTasks();
        setTasks(data);
        showToast("Failed to reorder tasks", "error");
      }
    },
    [showToast]
  );

  // ── Computed Values ────────────────────────────────────────────────
  const activeCount = useMemo(
    () => tasks.filter((t) => !t.completed).length,
    [tasks]
  );

  const completedCount = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply filter
    if (filter === "active") {
      result = result.filter((t) => !t.completed);
    } else if (filter === "completed") {
      result = result.filter((t) => t.completed);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((t) =>
        t.title.toLowerCase().includes(query)
      );
    }

    return result;
  }, [tasks, filter, searchQuery]);

  const value = useMemo(
    () => ({
      tasks,
      filteredTasks,
      loading,
      error,
      filter,
      searchQuery,
      activeCount,
      completedCount,
      toasts,
      setFilter,
      setSearchQuery,
      addTask,
      editTask,
      toggleTask,
      removeTask,
      reorderTasks,
      dismissToast,
    }),
    [
      tasks,
      filteredTasks,
      loading,
      error,
      filter,
      searchQuery,
      activeCount,
      completedCount,
      toasts,
      addTask,
      editTask,
      toggleTask,
      removeTask,
      reorderTasks,
      dismissToast,
    ]
  );

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────
export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
