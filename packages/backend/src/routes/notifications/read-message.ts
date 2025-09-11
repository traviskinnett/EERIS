import { eq } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { MessageTable } from "../../drizzle/schema";

export async function ReadMessage(fastify: FastifyInstance) {
  fastify.post("/message/read", async (req, reply) => {
    const { messageId } = req.body as {
      messageId?: number;
    };

    if (!messageId) {
      return reply.status(400).send({ error: "Message ID is required" });
    }
    // If a specific messageId was passed, mark it as Read
    await db
      .update(MessageTable)
      .set({ status: "Read" })
      .where(eq(MessageTable.id, messageId));

    return reply.status(200).send({ message: "Messages marked as read" });
  });
}
