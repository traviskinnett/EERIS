import { eq } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { MessageTable, UserTable } from "../../drizzle/schema";
export async function ListMessages(fastify: FastifyInstance) {
  fastify.post("/message/list", async (req, reply) => {
    const { uuid } = req.body as {
      uuid: string;
    };

    let messages;

    messages = await db
      .select()
      .from(MessageTable)
      .where(eq(MessageTable.receiverId, uuid));

    return messages;
  });
}
