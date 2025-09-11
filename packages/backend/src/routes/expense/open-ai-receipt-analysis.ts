import axios from "axios";
import { FastifyInstance } from "fastify";
import dotenv from "dotenv";
export const OpenAiImage = async (fastify: FastifyInstance) => {
  dotenv.config();
  fastify.post("/image/analyze", async (request, reply) => {
    const { image } = request.body as { image: string };
    try {
      const openaiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an OCR data extraction tool. You extract structured data from receipt images and return only valid JSON objects, with no extra explanation or formatting.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this receipt and return a JSON object with the following properties. If a value is not present, set it to null. Reply with ONLY the raw JSON object. Do not include any explanations, formatting, or text before or after.
      
      Return JSON with these exact keys:
      - storeName: string
      - storePhone: string
      - storeAddress: string
      - storeWebsite: string
      - paymentMethod: string
      - datetime: Date
      - totalAmount: number
      - category: string
      - items: array of objects with keys: name, quantity, unitPrice
      
      The category can only be one of the following: Food, Health, Gas, Travel, Entertainment, Utilities, Groceries, Office Supplies, Education. 
      The storePhone should be the form xxx-xxxx-xxxx.
      The items property should be all of the line items on the receipt, with the name, quantity, and unit price of each item. If there is no quantity, default to 1

      The output must be valid JSON and must begin with { and end with }.`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${image}`,
                  },
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.openai}`,
          },
        }
      );

      reply.send(openaiResponse.data);
    } catch (err) {
      console.error(err);
      reply.status(500).send({ error: "Failed to analyze image" });
    }
  });
};
