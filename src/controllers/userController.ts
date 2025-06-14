import { Request, Response } from "express";
import client from "../models/prisma";
import { hashPassword, compare } from "../utils/hash";
exports.getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await client.users.findMany({
      include: {
        todos: true,
      },
    });

    if (!users || users.length === 0) {
      return res.json({ message: "No users found" });
    }

    // Return users if found
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Error", error: err });
  }
};

exports.getUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    if (!userId) {
      return res.json({ message: "No user id found" });
    }
    const user = await client.users.findUnique({
      where: { id: userId },
      include: {
        todos: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};

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
    res.json({
      message: "Logged in successfully",
      user,
    });
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};

exports.delete = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const user = await client.users.delete({
      where: { id: userId },
    });
    return res.json({ message: "User deleted successfully", user });
  } catch (err: any) {
    if (err.code === "P2025") {
      // Prisma's "Record to delete does not exist."
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.edit = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const { username, password } = req.body;
    if (!username && !password) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const user = await client.users.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(password && { password }),
      },
    });
    res.json({
      message: "user edited ",
      user,
    });
  } catch (err: any) {
    return res.json({
      message: err.message,
    });
  }
};
