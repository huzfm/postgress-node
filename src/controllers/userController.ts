import { Request, Response } from "express";
import client from "../models/prisma";
exports.getAllUsers = async (req: Request, res: Response) => {
  try {
    // Get page and limit from query, with default values
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await client.users.findMany({
      skip,
      take: limit,
      include: {
        todos: true,
      },
    });

    // Get total count for metadata
    const totalUsers = await client.users.count();

    return res.json({
      total_users: totalUsers,
      users,
    });
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
