"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../models/prisma"));
exports.addTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title, description, done } = req.body;
        // Basic validation
        if (!userId || !title || !description || typeof done !== "string") {
            return res.json({ message: "Missing fields or invalid 'done' type" });
        }
        // Ensure user exists
        const user = yield prisma_1.default.users.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.json({ message: "User not found" });
        }
        // Create todo
        const todo = yield prisma_1.default.todo.create({
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
    }
    catch (err) {
        return res.json({ message: err.message });
    }
});
exports.getAllTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield prisma_1.default.todo.findMany({
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
    }
    catch (err) {
        return res.json({
            message: err.message,
        });
    }
});
exports.getTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        const todo = yield prisma_1.default.todo.findUnique({
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
    }
    catch (err) {
        return res.json({
            message: err.message,
        });
    }
});
exports.editTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoId = Number(req.params.id);
        const { title, description, done } = req.body;
        if (!title && !description && done === undefined) {
            return res.json({
                message: "Please provide at least one field to update",
            });
        }
        // Build update object dynamically
        const dataToUpdate = {};
        if (title)
            dataToUpdate.title = title;
        if (description)
            dataToUpdate.description = description;
        if (done !== undefined) {
            // If you keep done as String:
            // dataToUpdate.done = done;
            // OR if done is Boolean in schema, validate here:
            dataToUpdate.done = done;
        }
        const updatedTodo = yield prisma_1.default.todo.update({
            where: { id: todoId },
            data: dataToUpdate,
        });
        return res.json({
            message: "Todo updated successfully",
            todo: updatedTodo,
        });
    }
    catch (err) {
        return res.json({
            message: err.message,
        });
    }
});
exports.deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        const todo = yield prisma_1.default.todo.delete({
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
    }
    catch (err) {
        return res.json({ message: err.message });
    }
});
