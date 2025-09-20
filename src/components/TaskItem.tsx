"use client";

import { useState } from "react";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Trash2 } from "lucide-react";
import { TaskWithSubTasks } from "../types/TaskWithSubTasks";

interface TaskItemProps {
  task: TaskWithSubTasks;
  onTaskUpdate: (taskId: string, isCompleted: boolean) => void;
  onSubTaskUpdate: (subTaskId: string, isCompleted: boolean) => void;
  onTaskDelete: (taskId: string) => void;
}

export function TaskItem({ task, onTaskUpdate, onSubTaskUpdate, onTaskDelete }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleComplete = async (
    taskId: string,
    isCompleted: boolean,
    isSubtask: boolean = false
  ) => {
    setIsUpdating(true);
    if (isSubtask) onSubTaskUpdate(taskId, isCompleted);
    else onTaskUpdate(taskId, isCompleted);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      });
      if (!response.ok) throw new Error("Failed to update task status.");
    } catch (error) {
      console.error(error);
      if (isSubtask) onSubTaskUpdate(taskId, !isCompleted);
      else onTaskUpdate(taskId, !isCompleted);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task and its subtasks?")) return;

    setIsUpdating(true);
    try {
      await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      onTaskDelete(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setIsUpdating(false);
    }
  };

  return (
    <div className={`rounded-lg border bg-card p-4 shadow-sm transition-opacity ${isUpdating ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
      {/* Parent Task */}
      <div className="flex items-center gap-3">
        <Checkbox
          id={task.id}
          checked={task.isCompleted}
          onCheckedChange={(checked) => handleToggleComplete(task.id, Boolean(checked))}
          disabled={isUpdating}
        />
        <label
          htmlFor={task.id}
          className={`flex-1 cursor-pointer text-lg font-semibold tracking-tight ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}
        >
          {task.title}
        </label>
        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isUpdating} className="ml-auto rounded-full">
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          <span className="sr-only">Delete Task</span>
        </Button>
      </div>

      {/* Subtasks */}
      {task.subTasks.length > 0 && (
        <div className="mt-4 ml-4 space-y-3 border-l pl-5">
          {task.subTasks.map((subTask) => (
            <div key={subTask.id} className="flex items-center gap-3">
              <Checkbox
                id={subTask.id}
                checked={subTask.isCompleted}
                onCheckedChange={(checked) => handleToggleComplete(subTask.id, Boolean(checked), true)}
                disabled={isUpdating}
              />
              <label
                htmlFor={subTask.id}
                className={`flex-1 cursor-pointer text-muted-foreground ${subTask.isCompleted ? "line-through" : ""}`}
              >
                {subTask.title}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
