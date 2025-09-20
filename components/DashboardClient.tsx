"use client";

import { useState } from "react";
import { TaskItem } from "./TaskItem";
import { TaskWithSubTasks } from "../types/TaskWithSubTasks";

interface DashboardClientProps {
  initialTasks: TaskWithSubTasks[];
}

export function DashboardClient({ initialTasks }: DashboardClientProps) {
  const [tasks, setTasks] = useState(initialTasks);

  const handleParentTaskUpdate = (taskId: string, isCompleted: boolean) => {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, isCompleted } : task))
    );
  };

  const handleSubTaskUpdate = (subTaskId: string, isCompleted: boolean) => {
    setTasks((current) =>
      current.map((task) => ({
        ...task,
        subTasks: task.subTasks.map((sub) =>
          sub.id === subTaskId ? { ...sub, isCompleted } : sub
        ),
      }))
    );
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
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
