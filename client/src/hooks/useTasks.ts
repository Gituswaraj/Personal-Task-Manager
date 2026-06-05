import { useTaskContext } from "../context/TaskContext";

/**
 * Custom hook that provides access to the task context.
 * Convenience wrapper around useTaskContext for cleaner imports.
 *
 * @example
 * const { filteredTasks, addTask, loading } = useTasks();
 */
export function useTasks() {
  const context = useTaskContext();

  return {
    // Data
    tasks: context.tasks,
    filteredTasks: context.filteredTasks,
    loading: context.loading,
    error: context.error,
    activeCount: context.activeCount,
    completedCount: context.completedCount,

    // Filter & Search
    filter: context.filter,
    searchQuery: context.searchQuery,
    setFilter: context.setFilter,
    setSearchQuery: context.setSearchQuery,

    // Actions
    addTask: context.addTask,
    editTask: context.editTask,
    toggleTask: context.toggleTask,
    removeTask: context.removeTask,
    reorderTasks: context.reorderTasks,

    // Toasts
    toasts: context.toasts,
    dismissToast: context.dismissToast,
  };
}
