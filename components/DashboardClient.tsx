// src/components/DashboardClient.tsx
"use client";

import { useState } from "react";
import { TaskItem } from "./TaskItem";

// Define the TaskWithSubTasks type
export interface TaskWithSubTasks {
  id: string;
  title: string;
  isCompleted: boolean;
  subTasks: {
    id: string;
    title: string;
    isCompleted: boolean;
  }[];
}

interface DashboardClientProps {
  initialTasks: TaskWithSubTasks[];
}

export function DashboardClient({ initialTasks }: DashboardClientProps) {
  const [tasks, setTasks] = useState(initialTasks);

  // Handler for updating a PARENT task's state
  const handleParentTaskUpdate = (taskId: string, isCompleted: boolean) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted } : task
      )
    );
  };
  const handleTaskDelete = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  };
  // Handler for updating a SUBTASK's state
  const handleSubTaskUpdate = (subTaskId: string, isCompleted: boolean) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => ({
        ...task,
        subTasks: task.subTasks.map((subTask) =>
          subTask.id === subTaskId ? { ...subTask, isCompleted } : subTask
        ),
      }))
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
        <h2 className="text-xl font-semibold">You're all clear!</h2>
        <p className="mt-2 text-muted-foreground">
          Go to the homepage to break down a new problem into actionable steps.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onTaskUpdate={handleParentTaskUpdate}
          onSubTaskUpdate={handleSubTaskUpdate}
          onTaskDelete={handleTaskDelete} 
        />
      ))}
    </div>
  );
}