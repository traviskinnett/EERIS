import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";
import { connectionString } from "../db"; // reusing it

const client = new Client({ connectionString });

async function main() {
  try {
    await client.connect();
    const db = drizzle(client);
    await migrate(db, { migrationsFolder: "./src/drizzle/migrations" });
    console.log("✅ Migrations applied successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

main();
