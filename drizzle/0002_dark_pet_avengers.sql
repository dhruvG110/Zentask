ALTER TABLE "pomodoro_sessions" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "pomodoro_sessions" ADD COLUMN "session_type" "session_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "pomodoro_sessions" ADD COLUMN "duration_minutes" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "pomodoro_sessions" ADD COLUMN "completed_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "pomodoro_sessions" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "pomodoro_sessions" ADD CONSTRAINT "pomodoro_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;