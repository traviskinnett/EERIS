import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth";
import { addExpense } from "./routes/expense/add-expense";
import { UpdateExpense } from "./routes/expense/update-expense";
import { UpdateExpenseStatus } from "./routes/expense/update-expense-status";
import { SendMessage } from "./routes/notifications/send-message";
import { OpenAiImage } from "./routes/expense/open-ai-receipt-analysis";
import { ListExpenses } from "./routes/expense/list-expenses";
import { DeleteExpense } from "./routes/expense/delete-expense";
import { CategorySummary } from "./routes/expense/category-summary";
import { ListEmployees } from "./routes/notifications/list-employees";
import { ListMessages } from "./routes/notifications/list-messages";
import { ReadMessage } from "./routes/notifications/read-message";
import { ListUnreadMessages } from "./routes/notifications/list-unread-messages";

const fastify = Fastify({ logger: true, bodyLimit: 40 * 1024 * 1024 });

async function start() {
  await fastify.register(cors, {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "OPTIONS"],
  });

  await fastify.register(
    async (api) => {
      api.register(authRoutes);
      api.register(addExpense);
      api.register(UpdateExpense);
      api.register(UpdateExpenseStatus);
      api.register(SendMessage);
      api.register(OpenAiImage);
      api.register(ListExpenses);
      api.register(DeleteExpense);
      api.register(CategorySummary);
      api.register(ListEmployees);
      api.register(ListMessages);
      api.register(ReadMessage);
      api.register(ListUnreadMessages);
    },
    { prefix: "/api" }
  );

  fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err;
    console.log(`Server running at ${address}`);
  });
}

start();
