import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
) {
  return bcrypt.compare(password, hashedPassword);
}

export function createToken(userId: string) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in the environment");
  }

  return jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });
}
