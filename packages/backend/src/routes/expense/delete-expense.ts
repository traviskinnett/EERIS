import { eq } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { ReceiptTable, UserTable } from "../../drizzle/schema";

export async function DeleteExpense(fastify: FastifyInstance) {
  fastify.post("/expense/delete", async (req, reply) => {
    const { uuid, expenseId } = req.body as {
      uuid: string;
      expenseId: number;
    };

    try {
      const user = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.uuid, uuid))
        .limit(1);

      if (!user.length) {
        return reply.status(404).send({ error: "User not found" });
      }

      const role = user[0].role;

      const expense = await db
        .select()
        .from(ReceiptTable)
        .where(eq(ReceiptTable.id, expenseId))
        .limit(1);

      if (!expense.length) {
        return reply.status(404).send({ error: "Expense not found" });
      }

      const foundExpense = expense[0];

      if (role === "Manager") {
        // Manager can delete anything
        await db.delete(ReceiptTable).where(eq(ReceiptTable.id, expenseId));
        return reply
          .status(200)
          .send({ message: "Expense deleted by Manager" });
      } else {
        // Employee can delete only their own Pending expenses
        if (foundExpense.ownerId !== uuid) {
          return reply
            .status(403)
            .send({ error: "You can only delete your own expenses" });
        }
        if (foundExpense.status !== "Pending") {
          return reply
            .status(403)
            .send({ error: "You can only delete pending expenses" });
        }

        await db.delete(ReceiptTable).where(eq(ReceiptTable.id, expenseId));
        return reply
          .status(200)
          .send({ message: "Expense deleted by Employee" });
      }
    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Internal server error" });
    }
  });
}
