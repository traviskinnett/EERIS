import { eq } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { Expense } from "../../../../core/models/expense";
import { db } from "../../db";
import { ReceiptTable } from "../../drizzle/schema";

export async function UpdateExpense(fastify: FastifyInstance) {
  fastify.post("/expense/update", async (req, reply) => {
    try {
      const { expense } = req.body as {
        expense: Expense;
      };

      if (!expense.id) {
        return reply.status(400).send({
          message: "Expense ID is required",
        });
      }

      await db
        .update(ReceiptTable)
        .set({
          ownerId: expense.ownerId,
          totalAmount: expense.totalAmount,
          storePhone: expense.storePhone,
          storeName: expense.storeName,
          datetime: new Date(expense.datetime),
          storeAddress: expense.storeAddress,
          paymentMethod: expense.paymentMethod,
          storeWebsite: expense.storeWebsite,
          category: expense.category, // Added category
          items: expense.items,
        })
        .where(eq(ReceiptTable.id, expense.id))
        .execute()
        .catch((err) => {
          console.error(`Failed to update expense ${expense.id}`, err);
        });
      return reply
        .status(200)
        .send({ message: "Successfully updated expense" });
    } catch (err) {
      console.error("Failed to update expense", err);
    }
  });
}
