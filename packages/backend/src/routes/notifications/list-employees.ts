import { eq, ne } from "drizzle-orm";
import { FastifyInstance } from "fastify";
import { db } from "../../db";
import { UserTable } from "../../drizzle/schema";
export async function ListEmployees(fastify: FastifyInstance) {
  fastify.post("/user/list", async (req, reply) => {
    const { uuid } = req.body as {
      uuid: string;
    };

    let role = (
      await db.select().from(UserTable).where(eq(UserTable.uuid, uuid)).limit(1)
    )[0].role; // so only one user (even though uuid should be unique)

    let employees;


    if (role === "Manager") {
      // Managers see everyone _except_ themselves
      employees = await db
        .select({
          uuid: UserTable.uuid,
          name: UserTable.name,
        })
        .from(UserTable)
        .where(ne(UserTable.uuid, uuid));
    } else if (role === "Employee") {
      // Employees see only managers
      employees = await db
        .select({ uuid: UserTable.uuid, name: UserTable.name })
        .from(UserTable)
        .where(eq(UserTable.role, "Manager"));
    }

    if (!employees) {
      return reply.status(404).send({
        message: "No employees found",
      });
    }

    console.log(employees);
    return employees; // Return the list of employees
  });
}
