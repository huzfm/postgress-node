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
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
exports.getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.users.findMany({
            include: {
                todos: true,
            },
        });
        if (!users || users.length === 0) {
            return res.json({ message: "No users found" });
        }
        // Return users if found
        return res.json(users);
    }
    catch (err) {
        return res.status(500).json({ message: "Error", error: err });
    }
});
exports.getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        if (!userId) {
            return res.json({ message: "No user id found" });
        }
        const user = yield prisma_1.default.users.findUnique({
            where: { id: userId },
            include: {
                todos: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
    }
    catch (err) {
        return res.json({ message: err.message });
    }
});
exports.signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
        const hashed = yield (0, hash_1.hashPassword)(password);
        const user = yield prisma_1.default.users.create({
            data: {
                username,
                password: hashed,
            },
        });
        return res.json({
            message: "user added sucessfully",
            user,
        });
    }
    catch (err) {
        if (err.code === "P2002" && ((_b = (_a = err.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes("username"))) {
            return res.json({
                message: "Username already exists",
            });
        }
        return res.json({
            message: err.message,
        });
    }
});
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield prisma_1.default.users.findFirst({
            where: { username },
        });
        if (!user) {
            return res.json({
                message: "No user found please enter valid username",
            });
        }
        const isValid = yield (0, hash_1.compare)(password, user.password);
        if (!isValid) {
            return res.json({
                message: "Invalid credentials",
                user,
            });
        }
        const token = (0, jwt_1.signToken)(user.id);
        res.json({
            message: "Logged in successfully",
            user,
            token,
        });
    }
    catch (err) {
        return res.json({ message: err.message });
    }
});
exports.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        const user = yield prisma_1.default.users.delete({
            where: { id: userId },
        });
        return res.json({ message: "User deleted successfully", user });
    }
    catch (err) {
        if (err.code === "P2025") {
            // Prisma's "Record to delete does not exist."
            return res.status(404).json({ message: "User not found" });
        }
        return res
            .status(500)
            .json({ message: "Internal server error", error: err.message });
    }
});
exports.edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        const { username, password } = req.body;
        if (!username && !password) {
            return res.status(400).json({ message: "No fields to update" });
        }
        const user = yield prisma_1.default.users.update({
            where: { id: userId },
            data: Object.assign(Object.assign({}, (username && { username })), (password && { password })),
        });
        res.json({
            message: "user edited ",
            user,
        });
    }
    catch (err) {
        return res.json({
            message: err.message,
        });
    }
});
