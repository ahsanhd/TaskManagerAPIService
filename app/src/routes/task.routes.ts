import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask,
} from "../controllers/task.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", listTasks);
router.post("/", createTask);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
