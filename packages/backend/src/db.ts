import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./drizzle/schema";
import dotenv from "dotenv";

dotenv.config();

export const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
