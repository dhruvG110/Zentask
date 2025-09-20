// src/app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "../../lib/db";
import { tasks } from "../../lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { DashboardClient, TaskWithSubTasks } from "../../components/DashboardClient";
import { PomodoroTimer } from "../../components/PomodoroTimer";

export default async function DashboardPage() {
  const userId = (await auth()).userId;
  if (!userId) {
    redirect("/auth/sign-in");
  }

  // Fetch only the top-level tasks (where parentId is null)
  // and use Drizzle's `with` to also load all of their subTasks.
  const topLevelTasks = await db.query.tasks.findMany({
    where: and(
      eq(tasks.userId, userId),
      isNull(tasks?.parentId)
    ),
    with: {
      subTasks: true,
    },
    orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
  });

  // Map DB tasks to match the TaskWithSubTasks interface
  const mappedTasks: TaskWithSubTasks[] = topLevelTasks.map((task) => ({
    id: task.id,
    title: task.content, // map content to title
    isCompleted: task.isCompleted,
    subTasks: task.subTasks.map((sub) => ({
      id: sub.id,
      title: sub.content,
      isCompleted: sub.isCompleted,
    })),
  }));

  return (
    <>
      <div className="flex w-full justify-center items-center mt-4">
        <PomodoroTimer /> 
      </div>
      <main className="container mx-auto p-4 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="text-muted-foreground">
            Here are your problems and their action plans.
          </p>
        </div>
        
        {/* Pass the mapped tasks to the client component */}
        <DashboardClient initialTasks={mappedTasks} />
      </main>
    </>
  );
}
