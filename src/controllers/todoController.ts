import { Request, Response } from "express";
import client from "../models/prisma";

exports.addTodo = async (req: Request, res: Response) => {
  try {
    const { userId, title, description, done } = req.body;

    // Basic validation
    if (!userId || !title || !description || typeof done !== "string") {
      return res.json({ message: "Missing fields or invalid 'done' type" });
    }

    // Ensure user exists
    const user = await client.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    // Create todo
    const todo = await client.todo.create({
      data: {
        title,
        description,
        done,
        user: {
          connect: { id: userId },
        },
      },
    });

    return res.json({
      message: "Todo added successfully",
      todo,
    });
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};

exports.getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await client.todo.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!todos) {
      return res.json({
        message: " no todos found",
      });
    }
    return res.json(todos);
  } catch (err: any) {
    return res.json({
      message: err.message,
    });
  }
};

exports.getTodo = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const todo = await client.todo.findUnique({
      where: { id: userId },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!todo) {
      return res.json({
        message: "No todo found with this id",
      });
    }

    return res.json(todo);
  } catch (err: any) {
    return res.json({
      message: err.message,
    });
  }
};

exports.editTodo = async (req: Request, res: Response) => {
  try {
    const todoId = Number(req.params.id);
    const { title, description, done } = req.body;

    if (!title && !description && done === undefined) {
      return res.json({
        message: "Please provide at least one field to update",
      });
    }

    // Build update object dynamically
    const dataToUpdate: any = {};
    if (title) dataToUpdate.title = title;
    if (description) dataToUpdate.description = description;
    if (done !== undefined) {
      // If you keep done as String:
      // dataToUpdate.done = done;
      // OR if done is Boolean in schema, validate here:
      dataToUpdate.done = done;
    }

    const updatedTodo = await client.todo.update({
      where: { id: todoId },
      data: dataToUpdate,
    });

    return res.json({
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (err: any) {
    return res.json({
      message: err.message,
    });
  }
};

exports.deleteTodo = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const todo = await client.todo.delete({
      where: { id: userId },
    });
    if (!todo) {
      return res.json({
        message: "No todo found with this id",
      });
    }
    return res.json({
      message: "todo has been deleted",
      todo,
    });
  } catch (err: any) {
    return res.json({ message: err.message });
  }
};
