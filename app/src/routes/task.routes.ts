import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask,
} from "../controllers/task.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  validateTaskCreateBody,
  validateTaskUpdateBody,
} from "../middlewares/validation.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listTasks));
router.post("/", validateTaskCreateBody, asyncHandler(createTask));
router.get("/:id", asyncHandler(getTaskById));
router.patch("/:id", validateTaskUpdateBody, asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));

export default router;
