// src/app/dashboard/page.tsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "../../lib/db";
import { tasks } from "../../lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { DashboardClient } from "../../components/DashboardClient"; // We will create this next
import { PomodoroTimer } from "../../components/PomodoroTimer"; // Import the PomodoroTimer component
export default async function DashboardPage() {
  const  userId  = (await auth()).userId;
  if (!userId) {
    redirect("/auth/sign-in");
  }

  // Fetch only the top-level tasks (where parentId is null)
  // and use Drizzle's `with` to also load all of their subTasks.
  const topLevelTasks = await db.query.tasks.findMany({
    where: and(
      eq(tasks.userId, userId),
      isNull(tasks?.parentId) // This is how we get only the parent tasks
    ),
    with: {
      subTasks: true, // This tells Drizzle to fetch the related subtasks for each parent
    },
    orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
  });

  return (
    <>
    <div className="flex w-full justify-center items-center mt-4">

    <PomodoroTimer /> 
    </div>
    <main className="container mx-auto p-4 sm:p-8">
      {/* Add the PomodoroTimer component here */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
        <p className="text-muted-foreground">Here are your problems and their action plans.</p>
      </div>
      
      {/* We pass the server-fetched data to a Client Component for interactivity */}
      <DashboardClient initialTasks={topLevelTasks} />
    </main>
    </>
  );
}