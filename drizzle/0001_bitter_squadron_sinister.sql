ALTER TABLE "user_settings" DROP CONSTRAINT "user_settings_user_id_unique";--> statement-breakpoint
ALTER TABLE "pomodoro_sessions" DROP CONSTRAINT "pomodoro_sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_settings" DROP CONSTRAINT "user_settings_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parent_id_tasks_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pomodoro_sessions" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "pomodoro_sessions" DROP COLUMN "session_type";--> statement-breakpoint
ALTER TABLE "pomodoro_sessions" DROP COLUMN "duration_minutes";--> statement-breakpoint
ALTER TABLE "pomodoro_sessions" DROP COLUMN "completed_at";--> statement-breakpoint
ALTER TABLE "pomodoro_sessions" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "user_settings" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "user_settings" DROP COLUMN "theme";--> statement-breakpoint
ALTER TABLE "user_settings" DROP COLUMN "pomodoro_duration";--> statement-breakpoint
ALTER TABLE "user_settings" DROP COLUMN "short_break_duration";--> statement-breakpoint
ALTER TABLE "user_settings" DROP COLUMN "long_break_duration";--> statement-breakpoint
ALTER TABLE "user_settings" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "user_settings" DROP COLUMN "updated_at";