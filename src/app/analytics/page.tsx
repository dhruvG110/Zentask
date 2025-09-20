// src/app/analytics/page.tsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, tasks, pomodoroSessions } from "@/lib/db/schema";
import { and, eq, gte, sql } from 'drizzle-orm';
import { startOfToday, subDays, format } from 'date-fns';
import { DashboardStats } from '@/components/DashboardStats';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const today = startOfToday();
  const sevenDaysAgo = subDays(today, 6);

  // --- 1. Fetch data for the top stat cards ---
  const [user, tasksToday, sessionsToday, tasksLast7Days] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, userId) }),
    db.select({ count: sql<number>`count(*)` }).from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.isCompleted, true), gte(tasks.completedAt, today))),
    db.select({ count: sql<number>`count(*)` }).from(pomodoroSessions).where(and(eq(pomodoroSessions.userId, userId), gte(pomodoroSessions.completedAt, today))),
    db.select({ completedAt: tasks.completedAt }).from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.isCompleted, true), gte(tasks.completedAt, sevenDaysAgo)))
  ]);

  const stats = {
    streak: user?.currentStreak ?? 0,
    tasksCompleted: tasksToday[0]?.count ?? 0,
    sessionsCompleted: sessionsToday[0]?.count ?? 0,
  };

  // --- 2. Process data for the bar chart ---
  const dailyTaskCounts = tasksLast7Days.reduce((acc, task) => {
    const day = format(task.completedAt!, 'MMM d');
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(today, i);
    const day = format(date, 'MMM d');
    return {
      date: day,
      tasks: dailyTaskCounts[day] || 0,
    };
  }).reverse();

  return (
    <main className="container mx-auto max-w-4xl p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Review your productivity trends.</p>
      </div>
      
      <DashboardStats stats={stats} />
      
      <div className="mt-8">
        <AnalyticsCharts data={chartData} />
      </div>
    </main>
  );
}