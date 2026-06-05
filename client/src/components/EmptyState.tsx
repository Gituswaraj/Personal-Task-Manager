import type { ReactNode } from "react";
import { useTaskContext } from "../context/TaskContext";
import styles from "./EmptyState.module.css";

export default function EmptyState() {
  const { filter, searchQuery, tasks } = useTaskContext();

  // Determine the message based on context
  let icon: ReactNode = "📝";
  let title = "Your task list is empty";
  let description = "Add your first task to get started!";

  if (searchQuery.trim()) {
    icon = <img src="/empty-search.png" alt="No tasks found" className={styles.customIcon} />;
    title = "No tasks found";
    description = `No tasks match "${searchQuery}". Try a different search.`;
  } else if (filter === "active" && tasks.length > 0) {
    icon = "🎉";
    title = "All caught up!";
    description = "You have no active tasks. Great job!";
  } else if (filter === "completed" && tasks.length > 0) {
    icon = <img src="/empty-completed.png" alt="No completed tasks" className={styles.customIcon} />;
    title = "No completed tasks yet";
    description = "Complete a task to see it here.";
  }

  return (
    <div className={styles.emptyState}>
      <div className={styles.illustration}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
