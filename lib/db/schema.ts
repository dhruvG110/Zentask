// src/lib/db/schema.ts
import {
  pgTable,
  text,
  integer,
  date,
  boolean,
  timestamp,
  uuid,
  pgEnum,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations, type AnyColumn } from "drizzle-orm"; // Ensure AnyColumn is imported

// ENUMS (no changes here)
export const priorityEnum = pgEnum("priority", ["LOW", "MEDIUM", "HIGH"]);
export const themeEnum = pgEnum("theme", ["LIGHT", "DARK", "SYSTEM"]);
export const sessionTypeEnum = pgEnum("session_type", ["FOCUS", "SHORT_BREAK", "LONG_BREAK"]);

// USERS TABLE (no changes here)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  currentStreak: integer("current_streak").default(0).notNull(),
  lastTaskCompletionDate: date("last_task_completion_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// TASKS TABLE (with the fix applied)
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  priority: priorityEnum("priority").default("MEDIUM").notNull(),
  completedAt: timestamp("completed_at"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // --- THIS IS THE CORRECTED LINE ---
  parentId: uuid("parent_id").references((): AnyPgColumn => tasks.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// OTHER TABLES (no changes here)
export const userSettings = pgTable("user_settings", { /* ... */ });
// src/lib/db/schema.ts

// ... (keep all your other imports and table definitions)

export const pomodoroSessions = pgTable("pomodoro_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionType: sessionTypeEnum("session_type").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

// Also ensure the relation for it exists if you defined it
export const pomodoroSessionsRelations = relations(pomodoroSessions, ({ one }) => ({
	user: one(users, {
		fields: [pomodoroSessions.userId],
		references: [users.id],
	}),
}));

// RELATIONS (no changes here, but ensure they are correct)
export const usersRelations = relations(users, ({ one, many }) => ({
  tasks: many(tasks),
  settings: one(userSettings),
  pomodoroSessions: many(pomodoroSessions),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  parentTask: one(tasks, {
    fields: [tasks.parentId],
    references: [tasks.id],
    relationName: 'subTasks',
  }),
  subTasks: many(tasks, {
    relationName: 'subTasks',
  }),
}));

// ... other relations ...