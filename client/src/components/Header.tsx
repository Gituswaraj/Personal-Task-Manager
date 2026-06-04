import { CheckCircle } from "lucide-react";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <span className={styles.icon}>
          <CheckCircle size={32} />
        </span>
        TaskFlow
      </h1>
      <p className={styles.subtitle}>Stay organized, stay focused</p>
    </header>
  );
}
