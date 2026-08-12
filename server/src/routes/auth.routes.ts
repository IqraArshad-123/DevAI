import { Router } from "express";

import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} from "../controllers/auth.controller";

import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, getMe);

router.put("/me", protect, updateProfile);

export default router;
