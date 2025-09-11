import { eq } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { ReceiptTable, UserTable } from "../../drizzle/schema";
export async function ListExpenses(fastify: FastifyInstance) {
  fastify.post("/expense/list", async (req, reply) => {
    const { uuid } = req.body as {
      uuid: string;
    };

    let role = (
      await db.select().from(UserTable).where(eq(UserTable.uuid, uuid)).limit(1)
    )[0].role; // so only one user (even though uuid should be unique)

    let expenses;

    if (role === "Manager") {
      // if user is a manager, return all expenses
      expenses = await db.select().from(ReceiptTable);
    } else {
      // if user is employee, return expenses owned by that employee
      expenses = await db
        .select()
        .from(ReceiptTable)
        .where(eq(ReceiptTable.ownerId, uuid));
    }

    return expenses;
  });
}
