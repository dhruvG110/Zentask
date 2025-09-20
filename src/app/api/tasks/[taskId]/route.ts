import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "../../../../lib/db";
import { users, tasks } from "../../../../lib/db/schema";
import { and, eq } from "drizzle-orm";
import { isToday, isYesterday } from "date-fns";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ taskId: string }> } // params is a Promise
) {
  const params = await context.params; // await first
  const { taskId } = params;

  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
  context: { params: Promise<{ taskId: string }> }
) {
  const params = await context.params;
  const { taskId } = params;

  try {
    const { userId } = await auth();
    const { isCompleted } = await request.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.transaction(async (tx) => {
      await tx
        .update(tasks)
        .set({ isCompleted, completedAt: isCompleted ? new Date() : null })
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

      if (isCompleted) {
        const currentUser = await tx.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (currentUser) {
          const lastCompletion = currentUser.lastTaskCompletionDate;
          const today = new Date();
          let newStreak = currentUser.currentStreak;

          if (lastCompletion && isYesterday(lastCompletion)) {
            newStreak++;
          } else if (!lastCompletion || !isToday(lastCompletion)) {
            newStreak = 1;
          }

          await tx
            .update(users)
            .set({ currentStreak: newStreak, lastTaskCompletionDate: today.toISOString() })
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
