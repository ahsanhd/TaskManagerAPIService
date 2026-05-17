import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";

const taskTitleMaxLength = 120;
const taskDescriptionMaxLength = 500;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidTaskStatus(status: unknown) {
  return (
    status === undefined ||
    status === "PENDING" ||
    status === "IN_PROGRESS" ||
    status === "COMPLETED"
  );
}

function isValidDate(value: unknown) {
  if (value === undefined) {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}

function normalizeRequiredText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeOptionalText(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

export function validateSignupBody(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  const normalizedName = normalizeRequiredText(name);
  if (!normalizedName || normalizedName.length < 2) {
    return next(new AppError(400, "Name must be at least 2 characters long"));
  }

  if (typeof email !== "string" || !isValidEmail(email.trim())) {
    return next(new AppError(400, "Please provide a valid email address"));
  }

  if (typeof password !== "string" || password.length < 8) {
    return next(
      new AppError(400, "Password must be at least 8 characters long"),
    );
  }

  req.body.name = normalizedName;
  req.body.email = email.trim().toLowerCase();

  return next();
}

export function validateLoginBody(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body as { email?: string; password?: string };

  if (typeof email !== "string" || typeof password !== "string") {
    return next(new AppError(400, "Email and password are required"));
  }

  if (!isValidEmail(email.trim())) {
    return next(new AppError(400, "Please provide a valid email address"));
  }

  if (password.length < 8) {
    return next(
      new AppError(400, "Password must be at least 8 characters long"),
    );
  }

  req.body.email = email.trim().toLowerCase();

  return next();
}

export function validateTaskCreateBody(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { title, description, status, dueDate } = req.body as {
    title?: string;
    description?: string;
    status?: string;
    dueDate?: string;
  };

  const normalizedTitle = normalizeRequiredText(title);
  if (!normalizedTitle) {
    return next(new AppError(400, "Title is required"));
  }

  if (normalizedTitle.length > taskTitleMaxLength) {
    return next(
      new AppError(
        400,
        `Title must not exceed ${taskTitleMaxLength} characters`,
      ),
    );
  }

  const normalizedDescription = normalizeOptionalText(description);
  if (normalizedDescription === null) {
    return next(
      new AppError(400, "Description must be a non-empty string when provided"),
    );
  }

  if (
    normalizedDescription &&
    normalizedDescription.length > taskDescriptionMaxLength
  ) {
    return next(
      new AppError(
        400,
        `Description must not exceed ${taskDescriptionMaxLength} characters`,
      ),
    );
  }

  if (!isValidTaskStatus(status)) {
    return next(
      new AppError(400, "Status must be PENDING, IN_PROGRESS, or COMPLETED"),
    );
  }

  if (!isValidDate(dueDate)) {
    return next(new AppError(400, "Due date must be a valid date string"));
  }

  req.body.title = normalizedTitle;
  req.body.description = normalizedDescription;

  return next();
}

export function validateTaskUpdateBody(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { title, description, status, dueDate } = req.body as {
    title?: string;
    description?: string;
    status?: string;
    dueDate?: string;
  };

  if (title !== undefined) {
    const normalizedTitle = normalizeRequiredText(title);
    if (!normalizedTitle) {
      return next(new AppError(400, "Title must not be empty"));
    }

    if (normalizedTitle.length > taskTitleMaxLength) {
      return next(
        new AppError(
          400,
          `Title must not exceed ${taskTitleMaxLength} characters`,
        ),
      );
    }

    req.body.title = normalizedTitle;
  }

  if (description !== undefined) {
    const normalizedDescription = normalizeOptionalText(description);
    if (normalizedDescription === null) {
      return next(
        new AppError(
          400,
          "Description must be a non-empty string when provided",
        ),
      );
    }

    if (
      normalizedDescription &&
      normalizedDescription.length > taskDescriptionMaxLength
    ) {
      return next(
        new AppError(
          400,
          `Description must not exceed ${taskDescriptionMaxLength} characters`,
        ),
      );
    }

    req.body.description = normalizedDescription;
  }

  if (!isValidTaskStatus(status)) {
    return next(
      new AppError(400, "Status must be PENDING, IN_PROGRESS, or COMPLETED"),
    );
  }

  if (!isValidDate(dueDate)) {
    return next(new AppError(400, "Due date must be a valid date string"));
  }

  return next();
}
