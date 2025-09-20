// drizzle.config.ts
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

// Check for the database URL and throw a custom error if it's not found
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from your .env file");
}

export default {
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts", // <-- IMPORTANT: ADJUST THIS PATH IF YOU DON'T USE A 'src' FOLDER
  out: "./drizzle",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
