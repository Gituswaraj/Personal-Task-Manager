import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useTaskContext } from "../context/TaskContext";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const { setSearchQuery } = useTaskContext();
  const [localQuery, setLocalQuery] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  const handleClear = () => {
    setLocalQuery("");
    setSearchQuery("");
  };

  return (
    <div className={styles.searchWrapper}>
      <input
        id="search-tasks"
        type="text"
        className={styles.searchInput}
        placeholder="Search tasks..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        aria-label="Search tasks"
      />
      <Search size={18} className={styles.searchIcon} />
      {localQuery && (
        <button
          className={styles.clearBtn}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
