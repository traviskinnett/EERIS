import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth";

const fastify = Fastify({ logger: true });

async function start() {
  await fastify.register(cors, {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
  });

  fastify.register(authRoutes);

  fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err;
    console.log(`🚀 Server running at ${address}`);
  });
}

start();
