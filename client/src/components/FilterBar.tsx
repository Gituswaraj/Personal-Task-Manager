import { useTaskContext } from "../context/TaskContext";
import type { FilterStatus } from "../types";
import styles from "./FilterBar.module.css";

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export default function FilterBar() {
  const { filter, setFilter } = useTaskContext();

  return (
    <div className={styles.filterBar} role="tablist" aria-label="Filter tasks">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          id={`filter-${f.value}`}
          className={`${styles.filterBtn} ${
            filter === f.value ? styles.filterBtnActive : ""
          }`}
          onClick={() => setFilter(f.value)}
          role="tab"
          aria-selected={filter === f.value}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
