import type { Request, Response } from "express";
import { prisma } from "../config/db.js";

function getUserId(req: Request, res: Response) {
  if (!req.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }

  return req.userId;
}

function parseStatus(status: unknown) {
  if (status === undefined) {
    return undefined;
  }

  if (
    status === "PENDING" ||
    status === "IN_PROGRESS" ||
    status === "COMPLETED"
  ) {
    return status;
  }

  return null;
}

export async function listTasks(req: Request, res: Response) {
  const userId = getUserId(req, res);
  if (!userId) {
    return;
  }

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ tasks });
}

export async function createTask(req: Request, res: Response) {
  const userId = getUserId(req, res);
  if (!userId) {
    return;
  }

  const { title, description, status, dueDate } = req.body as {
    title?: string;
    description?: string;
    status?: string;
    dueDate?: string;
  };

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const parsedStatus = parseStatus(status);
  if (parsedStatus === null) {
    return res.status(400).json({
      message: "Status must be PENDING, IN_PROGRESS, or COMPLETED",
    });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: parsedStatus,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId,
    },
  });

  return res.status(201).json({ task });
}

export async function getTaskById(req: Request, res: Response) {
  const userId = getUserId(req, res);
  if (!userId) {
    return;
  }

  const task = await prisma.task.findFirst({
    where: {
      id: req.params.id,
      userId,
    },
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  return res.json({ task });
}

export async function updateTask(req: Request, res: Response) {
  const userId = getUserId(req, res);
  if (!userId) {
    return;
  }

  const existingTask = await prisma.task.findFirst({
    where: {
      id: req.params.id,
      userId,
    },
  });

  if (!existingTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { title, description, status, dueDate } = req.body as {
    title?: string;
    description?: string;
    status?: string;
    dueDate?: string;
  };

  const parsedStatus = parseStatus(status);
  if (parsedStatus === null) {
    return res.status(400).json({
      message: "Status must be PENDING, IN_PROGRESS, or COMPLETED",
    });
  }

  const updatedTask = await prisma.task.update({
    where: { id: existingTask.id },
    data: {
      title: title ?? existingTask.title,
      description: description ?? existingTask.description,
      status: parsedStatus ?? existingTask.status,
      dueDate: dueDate ? new Date(dueDate) : existingTask.dueDate,
    },
  });

  return res.json({ task: updatedTask });
}

export async function deleteTask(req: Request, res: Response) {
  const userId = getUserId(req, res);
  if (!userId) {
    return;
  }

  const existingTask = await prisma.task.findFirst({
    where: {
      id: req.params.id,
      userId,
    },
  });

  if (!existingTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  await prisma.task.delete({
    where: { id: existingTask.id },
  });

  return res.status(204).send();
}
