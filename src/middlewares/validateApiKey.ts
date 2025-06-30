import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const validateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      res.status(401).json({ message: "API key is missing" });
      return;
    }

    const key = await client.apiKey.findUnique({ where: { key: apiKey } });

    if (!key || !key.isActive) {
      res.status(403).json({ message: "Invalid or inactive API key" });
      return;
    }

    next(); // ✅ Continue to controller
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err });
  }
};
