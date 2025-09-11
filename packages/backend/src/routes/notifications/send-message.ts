import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { MessageTable } from "../../drizzle/schema"; // Ensure this is correctly defined
import { Message } from "../../../../core/models/message"; // Ensure this is correctly defined
// import { NotificationType } from "../../../core/models/expense"; // Reuse or duplicate if needed

export async function SendMessage(fastify: FastifyInstance) {
  fastify.post("/message/send", async (req, reply) => {
    try {
      const { message } = req.body as {
        message: Message;
        // type: NotificationType;
      };

      const datetime = new Date();

      await db.insert(MessageTable).values({
        subject: message.subject,
        content: message.content,
        datetime: datetime,
        senderId: message.senderId,
        senderName: message.senderName,
        receiverId: message.receiverId,
        receiverName: message.receiverName,
        status: "Unread",
      });

      return reply.status(200).send({
        message: "Message queued for delivery",
      });
    } catch (err) {
      console.error("Failed to send message", err);
      return reply.status(500).send({
        message: "Failed to send message",
      });
    }
  });
}
