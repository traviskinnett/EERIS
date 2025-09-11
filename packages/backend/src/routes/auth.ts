import { FastifyInstance } from "fastify";
import { db } from "../db";
import { UserTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth", async (req, reply) => {
    const { uuid, email, name, role } = req.body as {
      uuid: string;
      email: string;
      name: string;
      role: string;
    };

    const existing = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.uuid, uuid));

    if (existing.length === 0) {
      await db.insert(UserTable).values({
        uuid,
        email,
        name,
        role: role || "Employee", // 👈 use provided role, fallback to "Employee" if missing
        department: "Unassigned",
      });

      console.log("✅ New user inserted:", email, "Role:", role);
    }

    reply.send({ success: true });
  });

  fastify.get("/user/:uuid", async (req, reply) => {
    const { uuid } = req.params as { uuid: string };

    try {
      const result = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.uuid, uuid));

      if (result.length === 0) {
        return reply.status(404).send({ error: "User not found" });
      }

      const user = result[0];
      return reply.send({
        role: user.role,
        department: user.department,
      });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return reply.status(500).send({ error: "Internal server error" });
    }
  });
}
