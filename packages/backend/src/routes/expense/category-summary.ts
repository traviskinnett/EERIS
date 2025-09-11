// routes/expense/category-summary.ts
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { ReceiptTable } from "../../drizzle/schema";

export async function CategorySummary(fastify: FastifyInstance) {
  fastify.post(
    "/expense/category-summary",
    async (request, reply) => {
      const { uuid } = request.body as { uuid: string };

      // sum up totalAmount per category for this owner
      const rows = await db
        .select({
          category: ReceiptTable.category,
          amount: sql`SUM(${ReceiptTable.totalAmount})`.as("amount"),
        })
        .from(ReceiptTable)
        .where(eq(ReceiptTable.owner, uuid))
        .groupBy(ReceiptTable.category);

      return rows;
    }
  );
}
