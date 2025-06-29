"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratelimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const time = 1 * 60 * 1000;
exports.ratelimiter = (0, express_rate_limit_1.default)({
    windowMs: time, // 10 seconds
    max: 1, // Max 3 requests per IP every 10s
    message: {
        status: 429,
        error: `Too many requests – try again in ${time} seconds.`,
    },
    standardHeaders: true, // Adds `RateLimit-*` headers
    legacyHeaders: false, // Disables `X-RateLimit-*` headers (for modern clients)
});
