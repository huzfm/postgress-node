import rateLimit from "express-rate-limit";
const time = 1 * 60 * 1000;
export const ratelimiter = rateLimit({
  windowMs: time, // 10 seconds
  max: 1, // Max 3 requests per IP every 10s
  message: {
    status: 429,
    error: `Too many requests – try again in ${time} seconds.`,
  },
  standardHeaders: true, // Adds `RateLimit-*` headers
  legacyHeaders: false, // Disables `X-RateLimit-*` headers (for modern clients)
});
