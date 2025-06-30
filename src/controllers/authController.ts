import { Request, Response } from "express";
import client from "../models/prisma";
import { hashPassword, compare } from "../utils/hash";
import { signToken } from "../utils/jwt";

import * as crypto from "crypto";

exports.signup = async (req: Request, res: Response) => {
  try {
    const { username, password, confirmPassword } = req.body;
    if (!username) {
      return res.json({ message: "No username" });
    }
    if (!password) {
      return res.json({ message: "No password" });
    }
    if (!confirmPassword) {
      return res.json({ message: "Please confirm the password" });
    }
    if (password != confirmPassword) {
      return res.json({
        message: " passwords do not match",
      });
    }
    const hashed = await hashPassword(password);
    const user = await client.users.create({
      data: {
        username,
        password: hashed,
      },
    });
    return res.json({
      message: "user added sucessfully",
      user,
    });
  } catch (err: any) {
    if (err.code === "P2002" && err.meta?.target?.includes("username")) {
      return res.json({
        message: "Username already exists",
      });
    }
    return res.json({
      message: err.message,
    });
  }
};

exports.login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await client.users.findFirst({
      where: { username },
    });
    if (!user) {
      return res.json({
        message: "No user found please enter valid username",
      });
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return res.json({
        message: "Invalid credentials",
        user,
      });
    }
    const token = signToken(user.id);
    res.json({
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};

exports.generateApiKey = async (req: Request, res: Response) => {
  try {
    const apiKey = crypto.randomBytes(32).toString("hex");

    await client.apiKey.create({
      data: {
        key: apiKey,
      },
    });

    res.json({
      message: "API key generated successfully",
      apiKey,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate API key" });
  }
};
