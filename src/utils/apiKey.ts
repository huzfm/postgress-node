import { PrismaClient } from "@prisma/client";
const crypto = require("crypto");
const client = new PrismaClient();

const generateKey = async () => {
  const apiKey = crypto.randomBytes(32).toString("hex");
  await client.apiKey.create({
    data: {
      key: apiKey,
      createdAt: new Date(),
    },
  });
  console.log(`API Key generated: ${apiKey}`);
};
generateKey();
