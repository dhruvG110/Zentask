// src/lib/db/index.ts
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

// Create a new connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

// Pass the pool to drizzle instead of the http client
export const db = drizzle(pool, { schema });