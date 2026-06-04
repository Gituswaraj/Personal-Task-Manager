import { Check, Pencil, Trash2, Calendar, GripVertical } from "lucide-react";
import type { Task } from "../types";
import { isOverdue, formatDate, formatRelativeDate } from "../utils/dateUtils";
import styles from "./TaskCard.module.css";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  dragHandleProps?: any;
}

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  dragHandleProps,
}: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.completed);

  const cardClasses = [
    styles.card,
    task.completed ? styles.cardCompleted : "",
    overdue ? styles.cardOverdue : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses} id={`task-${task.id}`}>
      {/* Drag Handle */}
      <div className={styles.dragHandle} {...dragHandleProps}>
        <GripVertical size={16} />
      </div>

      {/* Checkbox */}
      <button
        className={`${styles.checkbox} ${
          task.completed ? styles.checkboxChecked : ""
        }`}
        onClick={() => onToggle(task.id, !task.completed)}
        aria-label={
          task.completed ? "Mark as incomplete" : "Mark as complete"
        }
      >
        {task.completed && <Check size={14} className={styles.checkIcon} />}
      </button>

      {/* Content */}
      <div className={styles.content}>
        <h3
          className={`${styles.title} ${
            task.completed ? styles.titleCompleted : ""
          }`}
        >
          {task.title}
        </h3>

        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}

        <div className={styles.meta}>
          {task.dueDate && (
            <span
              className={`${styles.dateBadge} ${
                overdue
                  ? styles.dateBadgeOverdue
                  : task.completed
                  ? styles.dateBadgeCompleted
                  : ""
              }`}
              title={formatDate(task.dueDate)}
            >
              <Calendar size={12} />
              {formatRelativeDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.actionBtn}
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          <Pencil size={16} />
        </button>
        <button
          className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
          onClick={() => onDelete(task)}
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
