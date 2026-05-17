import { Router } from "express";
import { login, signup } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  validateLoginBody,
  validateSignupBody,
} from "../middlewares/validation.middleware.js";

const router = Router();

router.post("/signup", validateSignupBody, asyncHandler(signup));
router.post("/login", validateLoginBody, asyncHandler(login));

export default router;
