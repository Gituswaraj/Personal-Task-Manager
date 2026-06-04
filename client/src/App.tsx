import { useState } from "react";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import { TaskProvider, useTaskContext } from "./context/TaskContext";
import type { Task, TaskFormData } from "./types";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import ConfirmDialog from "./components/ConfirmDialog";
import "./App.css";

function AppContent() {
  const { addTask, editTask, removeTask, toasts, dismissToast } =
    useTaskContext();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // ── Handlers ────────────────────────────────────────────────────
  const handleAdd = async (data: TaskFormData) => {
    await addTask(data);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleEditSubmit = async (data: TaskFormData) => {
    if (editingTask) {
      await editTask(editingTask.id, data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingTask) {
      await removeTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <Header />

      {/* Stats */}
      <StatsBar />

      {/* Toolbar */}
      <div className="toolbar">
        <SearchBar />
        <FilterBar />
      </div>

      {/* Task List */}
      <TaskList
        onEdit={handleEdit}
        onDelete={(task) => setDeletingTask(task)}
      />

      {/* FAB — Add New Task */}
      <button
        className="fab"
        onClick={() => {
          setEditingTask(null);
          setShowForm(true);
        }}
        aria-label="Add new task"
        id="add-task-fab"
      >
        <Plus size={24} />
      </button>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          editingTask={editingTask}
          onSubmit={editingTask ? handleEditSubmit : handleAdd}
          onClose={handleCloseForm}
        />
      )}

      {/* Delete Confirmation */}
      {deletingTask && (
        <ConfirmDialog
          task={deletingTask}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingTask(null)}
        />
      )}

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="toastContainer">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`toast ${
                toast.type === "success" ? "toastSuccess" : "toastError"
              }`}
              onClick={() => dismissToast(toast.id)}
            >
              {toast.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <XCircle size={16} />
              )}
              {toast.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;
