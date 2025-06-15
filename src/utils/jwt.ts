import jwt from "jsonwebtoken";
export const signToken = (userId: number) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ userId }, secret, {
    expiresIn: "1h",
  });
};
