// src/app/api/message/route.ts

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server"; 
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../../../lib/db";
import { users, tasks } from "../../../lib/db/schema";
import { eq } from "drizzle-orm"; // Import eq for the user check

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    // --- EDITED: Minor performance tweak using Promise.all ---
    // Fetch user and parse request body concurrently
    const [user, { problem }] = await Promise.all([
      currentUser(),
      request.json(),
    ]);

    // 1. Get the full user object from Clerk and validate
    if (!user || !user.id || !user.primaryEmailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = user.id;

    // --- EDITED: Added input validation for security and stability ---
    if (!problem || typeof problem !== 'string' || problem.length > 500) {
      return new NextResponse("Invalid input: Problem must be a string under 500 characters.", { status: 400 });
    }

    // --- EDITED: More efficient user syncing logic ---
    // This now avoids a database write on every single request.
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    const clerkUserName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    if (!dbUser) {
      // User is new, create them.
      await db.insert(users).values({
        id: userId,
        email: user.primaryEmailAddress.emailAddress,
        name: clerkUserName,
      });
    } else if (dbUser.name !== clerkUserName || dbUser.email !== user.primaryEmailAddress.emailAddress) {
      // User exists, but their details have changed. Update them.
      await db.update(users).set({
        name: clerkUserName,
        email: user.primaryEmailAddress.emailAddress,
        updatedAt: new Date(),
      }).where(eq(users.id, userId));
    }
    // If user exists and details are the same, we do nothing.

    // --- 4. AI GENERATION WITH STRICTER CONTROLS ---
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      systemInstruction: "You are a helpful assistant designed to output JSON.",
    });

    const generationConfig = {
      temperature: 0.2,
      responseMimeType: "application/json",
    };

    const prompt = `
      Take the user's problem and break it down into exactly seven, actionable steps: "${problem}"
      Provide a response as a single, clean JSON object with keys "1" through "7".
      Example: { "1": "First step...", "2": "Second step..." }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const responseText = result.response.text();
    const stepsObject = JSON.parse(responseText);
    const stepsArray = Object.values(stepsObject) as string[];

    if (stepsArray.length === 0) {
      throw new Error("AI returned empty steps.");
    }

    // 5. Save tasks to the database in a safe transaction
    const newParentTask = await db.transaction(async (tx) => {
      const [parentTask] = await tx.insert(tasks).values({ content: problem, userId }).returning();
      if (!parentTask) throw new Error("Failed to create parent task.");

      const subTasksData = stepsArray.map((step) => ({
        content: step,
        userId: userId,
        parentId: parentTask.id,
      }));
      await tx.insert(tasks).values(subTasksData);
      return parentTask;
    });

    // 6. Return a clean success response
    return NextResponse.json({ success: true, parentTaskId: newParentTask.id });

  } catch (error) {
    console.error("[API_ROUTE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}