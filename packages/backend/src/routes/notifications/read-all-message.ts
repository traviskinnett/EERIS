import { eq } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { MessageTable } from "../../drizzle/schema";

export async function ReadMessage(fastify: FastifyInstance) {
  fastify.post("/message/read", async (req, reply) => {
    const { uuid } = req.body as {
      uuid: string;
    };

    if (!uuid) {
      return reply.status(400).send({ error: "UUID is required" });
    }

    // If a specific messageId was passed, mark it as Read

    await db
      .update(MessageTable)
      .set({ status: "Read" })
      .where(eq(MessageTable.receiverId, uuid));

    return reply.status(200).send({ message: "All messages marked as read" });
  });
}
