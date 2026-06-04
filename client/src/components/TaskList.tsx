import { AlertCircle, RefreshCw } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useTaskContext } from "../context/TaskContext";
import type { Task } from "../types";
import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";
import styles from "./TaskList.module.css";

interface TaskListProps {
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskList({ onEdit, onDelete }: TaskListProps) {
  const {
    filteredTasks,
    loading,
    error,
    toggleTask,
    reorderTasks,
    filter,
    searchQuery,
  } = useTaskContext();

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const reordered = Array.from(filteredTasks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const orderedIds = reordered.map((t) => t.id);
    reorderTasks(orderedIds);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={styles.listContainer}>
        <div className={styles.skeletonList}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div
                className={`${styles.skeletonCircle} skeleton`}
              />
              <div className={styles.skeletonContent}>
                <div
                  className={`${styles.skeletonLine} ${styles.skeletonLineLong} skeleton`}
                />
                <div
                  className={`${styles.skeletonLine} ${styles.skeletonLineShort} skeleton`}
                />
                <div
                  className={`${styles.skeletonLine} ${styles.skeletonLineXs} skeleton`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.listContainer}>
        <div className={styles.errorState}>
          <AlertCircle size={48} className={styles.errorIcon} />
          <h3 className={styles.errorTitle}>Something went wrong</h3>
          <p className={styles.errorMessage}>{error}</p>
          <button
            className={styles.retryBtn}
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} style={{ marginRight: 8 }} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (filteredTasks.length === 0) {
    return (
      <div className={styles.listContainer}>
        <EmptyState />
      </div>
    );
  }

  // Disable drag-and-drop when filtering or searching
  const isDragDisabled =
    filter !== "all" || searchQuery.trim().length > 0;

  return (
    <div className={styles.listContainer}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="task-list">
          {(provided) => (
            <div
              className={styles.taskList}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {filteredTasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id}
                  index={index}
                  isDragDisabled={isDragDisabled}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={
                        snapshot.isDragging ? styles.dragging : ""
                      }
                    >
                      <TaskCard
                        task={task}
                        onToggle={toggleTask}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        dragHandleProps={
                          isDragDisabled
                            ? undefined
                            : provided.dragHandleProps ?? undefined
                        }
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
