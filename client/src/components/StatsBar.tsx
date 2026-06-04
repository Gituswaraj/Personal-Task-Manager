import { useTaskContext } from "../context/TaskContext";
import styles from "./StatsBar.module.css";

export default function StatsBar() {
  const { activeCount, completedCount } = useTaskContext();

  return (
    <div className={styles.statsBar}>
      <span className={`${styles.stat} ${styles.statActive}`}>
        <span className={`${styles.statDot} ${styles.dotActive}`} />
        <span className={styles.statCount}>{activeCount}</span> Active
      </span>
      <span className={`${styles.stat} ${styles.statCompleted}`}>
        <span className={`${styles.statDot} ${styles.dotCompleted}`} />
        <span className={styles.statCount}>{completedCount}</span> Completed
      </span>
    </div>
  );
}
