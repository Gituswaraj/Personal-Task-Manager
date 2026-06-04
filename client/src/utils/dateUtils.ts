/**
 * Check if a task is overdue (due date is in the past and task is not completed).
 */
export function isOverdue(dueDate: string | null, completed: boolean): boolean {
  if (!dueDate || completed) return false;
  return new Date(dueDate) < new Date();
}

/**
 * Format a date string to a human-readable format (e.g., "Jun 15, 2026").
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date to a relative string (e.g., "Due in 3 days", "Overdue by 2 days").
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays === -1) return "Overdue by 1 day";
  if (diffDays > 0) return `Due in ${diffDays} days`;
  return `Overdue by ${Math.abs(diffDays)} days`;
}

/**
 * Convert an ISO date string to an input[type="date"] value (YYYY-MM-DD).
 */
export function toDateInputValue(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

/**
 * Convert an input[type="date"] value to an ISO date string.
 */
export function fromDateInputValue(dateValue: string): string | null {
  if (!dateValue) return null;
  return new Date(dateValue + "T23:59:59").toISOString();
}
