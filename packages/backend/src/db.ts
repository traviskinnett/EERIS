import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./drizzle/schema";

export const connectionString = "postgres://swepj:12345@localhost:5432/eeris-7-swe";

const pool = new Pool({ connectionString });


export const db = drizzle(pool, { schema });
