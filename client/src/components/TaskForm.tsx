import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import type { Task, TaskFormData } from "../types";
import { toDateInputValue } from "../utils/dateUtils";
import styles from "./TaskForm.module.css";

interface TaskFormProps {
  editingTask?: Task | null;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onClose: () => void;
}

export default function TaskForm({
  editingTask,
  onSubmit,
  onClose,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [titleError, setTitleError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill when editing
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(toDateInputValue(editingTask.dueDate));
    }
  }, [editingTask]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const validate = useCallback((): boolean => {
    if (!title.trim()) {
      setTitleError("Title is required");
      return false;
    }
    if (title.trim().length > 200) {
      setTitleError("Title must be 200 characters or less");
      return false;
    }
    setTitleError("");
    return true;
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({ title, description, dueDate });
      onClose();
    } catch {
      // Error is handled by context toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={editingTask ? "Edit task" : "Add new task"}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            {editingTask ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className={styles.field}>
            <label htmlFor="task-title" className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className={`${styles.input} ${
                titleError ? styles.inputError : ""
              }`}
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              autoFocus
            />
            {titleError && (
              <p className={styles.errorText}>{titleError}</p>
            )}
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label htmlFor="task-description" className={styles.label}>
              Description
            </label>
            <textarea
              id="task-description"
              className={styles.textarea}
              placeholder="Add more details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Due Date */}
          <div className={styles.field}>
            <label htmlFor="task-due-date" className={styles.label}>
              Due Date
            </label>
            <input
              id="task-due-date"
              type="date"
              className={styles.input}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting}
              id="submit-task"
            >
              {submitting
                ? "Saving..."
                : editingTask
                ? "Save Changes"
                : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
