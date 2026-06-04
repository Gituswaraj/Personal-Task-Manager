import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import type { Task } from "../types";
import styles from "./ConfirmDialog.module.css";

interface ConfirmDialogProps {
  task: Task;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  task,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-label="Delete confirmation"
      >
        <div className={styles.icon}>
          <AlertTriangle size={24} />
        </div>
        <h3 className={styles.title}>Delete Task</h3>
        <p className={styles.message}>
          Are you sure you want to delete{" "}
          <span className={styles.taskTitle}>"{task.title}"</span>? This
          action cannot be undone.
        </p>
        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={onCancel}
            id="cancel-delete"
          >
            Cancel
          </button>
          <button
            className={styles.deleteBtn}
            onClick={onConfirm}
            id="confirm-delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
