import { useTaskContext } from "../context/TaskContext";
import styles from "./EmptyState.module.css";

export default function EmptyState() {
  const { filter, searchQuery, tasks } = useTaskContext();

  // Determine the message based on context
  let emoji = "📝";
  let title = "Your task list is empty";
  let description = "Add your first task to get started!";

  if (searchQuery.trim()) {
    emoji = "🔍";
    title = "No tasks found";
    description = `No tasks match "${searchQuery}". Try a different search.`;
  } else if (filter === "active" && tasks.length > 0) {
    emoji = "🎉";
    title = "All caught up!";
    description = "You have no active tasks. Great job!";
  } else if (filter === "completed" && tasks.length > 0) {
    emoji = "💪";
    title = "No completed tasks yet";
    description = "Complete a task to see it here.";
  }

  return (
    <div className={styles.emptyState}>
      <div className={styles.illustration}>{emoji}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
