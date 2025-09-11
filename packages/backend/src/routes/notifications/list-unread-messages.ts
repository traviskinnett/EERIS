import { and, eq } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { MessageTable } from "../../drizzle/schema";
import { Message } from "../../../../core/models/message";
export async function ListUnreadMessages(fastify: FastifyInstance) {
  fastify.post("/message/unread", async (req, reply) => {
    const { uuid } = req.body as {
      uuid: string;
    };

    if (!uuid) {
      return reply.status(500).send({ error: "UUID is required" });
    }
    let messages: Message[] = [];

    messages = await db
      .select()
      .from(MessageTable)
      .where(
        and(
          eq(MessageTable.receiverId, uuid),
          eq(MessageTable.status, "Unread")
        )
      );

    return messages;
  });
}
