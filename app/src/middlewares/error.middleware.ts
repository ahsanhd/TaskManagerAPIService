import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, "Route not found"));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error("Unhandled error:", error);
  return res.status(500).json({ message: "Something went wrong" });
}