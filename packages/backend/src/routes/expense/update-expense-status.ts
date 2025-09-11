import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { ReceiptTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function UpdateExpenseStatus(fastify: FastifyInstance) {
  fastify.put("/expense/status", async (req, reply) => {
    const { expenseId, status } = req.body as {
      expenseId: number;
      status: "Approved" | "Denied";
    };

    if (!expenseId || !["Approved", "Denied", "Pending"].includes(status)) {
      return reply.status(400).send({ error: "Invalid input" });
    }    

    try {
      await db
        .update(ReceiptTable)
        .set({ status })
        .where(eq(ReceiptTable.id, expenseId));

      return reply.send({ success: true });
    } catch (error) {
      console.error("Error updating status:", error);
      return reply.status(500).send({ error: "Failed to update status" });
    }
  });
}
