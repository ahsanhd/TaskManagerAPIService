import express from "express";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Task Management API is running" });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
