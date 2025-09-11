import { FastifyInstance } from "fastify";
import { Expense } from "../../../../core/models/expense";
import { db } from "../../db";
import { ReceiptTable, UserTable } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
export async function addExpense(fastify: FastifyInstance) {
  fastify.post("/expense/create", async (req, reply) => {
    const { expense } = req.body as {
      expense: Expense;
    };
    const [userRow] = await db
      .select({ name: UserTable.name })
      .from(UserTable)
      .where(eq(UserTable.uuid, expense.ownerId));
    if (!userRow) {
      reply.status(400).send({ error: "Invalid ownerId" });
      return;
    }

    await db.insert(ReceiptTable).values({
      ownerId: expense.ownerId,
      ownerName: userRow.name,
      totalAmount: expense.totalAmount,
      storePhone: expense.storePhone,
      storeName: expense.storeName,
      datetime: new Date(expense.datetime),
      storeAddress: expense.storeAddress,
      paymentMethod: expense.paymentMethod,
      storeWebsite: expense.storeWebsite,
      category: expense.category, // Added category
      items: expense.items,
    });
  });
}
