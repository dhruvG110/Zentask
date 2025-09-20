// src/components/DashboardStats.tsx

import { Flame, CheckCircle, Timer } from "lucide-react";

interface Stats {
  streak: number;
  tasksCompleted: number;
  sessionsCompleted: number;
}

interface DashboardStatsProps {
  stats: Stats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      name: "Daily Streak",
      value: `${stats.streak} Day${stats.streak === 1 ? '' : 's'}`,
      icon: <Flame className="h-5 w-5 text-orange-500" />,
    },
    {
      name: "Tasks Completed Today",
      value: stats.tasksCompleted,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      name: "Focus Sessions Today",
      value: stats.sessionsCompleted,
      icon: <Timer className="h-5 w-5 text-blue-500" />,
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {statItems.map((item) => (
        <div key={item.name} className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            {item.icon}
            <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
          </div>
          <p className="mt-2 text-2xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}