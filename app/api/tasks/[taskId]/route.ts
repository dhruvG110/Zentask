// src/app/api/tasks/[taskId]/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "../../../../lib/db";
import { users, tasks } from "../../../../lib/db/schema";
import { and, eq } from "drizzle-orm";
import { isToday, isYesterday } from 'date-fns';

export async function DELETE(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { userId } = auth();
    const taskId = params.taskId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // The 'where' clause ensures a user can only delete their OWN tasks.
    await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE_TASK_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { userId } = await auth();
    const { isCompleted } = await request.json();
    const taskId = params.taskId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Use a transaction to update the task and the user's streak atomically
    await db.transaction(async (tx) => {
      // 1. Update the task's completion status
      await tx
        .update(tasks)
        .set({ isCompleted, completedAt: isCompleted ? new Date() : null })
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

      // 2. If a task was marked complete, update the user's streak
      if (isCompleted) {
        const currentUser = await tx.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (currentUser) {
          const lastCompletion = currentUser.lastTaskCompletionDate;
          const today = new Date();

          // If last completion was yesterday, increment streak.
          // If it wasn't today already, set streak to 1.
          let newStreak = currentUser.currentStreak;
          if (lastCompletion && isYesterday(lastCompletion)) {
            newStreak++;
          } else if (!lastCompletion || !isToday(lastCompletion)) {
            newStreak = 1;
          }
          // If a task was already completed today, streak doesn't change.

          await tx
            .update(users)
            .set({ currentStreak: newStreak, lastTaskCompletionDate: today })
            .where(eq(users.id, userId));
        }
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("[UPDATE_TASK_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}