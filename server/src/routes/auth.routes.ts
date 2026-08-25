import { Router } from "express";

import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  updateSettings,
  changePassword,
} from "../controllers/auth.controller";

import { protect } from "../middleware/auth.middleware";

const router = Router();

// =====================================================
// AUTH
// =====================================================

router.post("/register", registerUser);

router.post("/login", loginUser);

// =====================================================
// CURRENT USER
// =====================================================

router.get("/me", protect, getMe);

// =====================================================
// PROFILE
// =====================================================

router.put("/me", protect, updateProfile);

// =====================================================
// SETTINGS
// =====================================================

router.put(
  "/settings",
  protect,
  updateSettings
);

// =====================================================
// SECURITY
// =====================================================

router.put(
  "/change-password",
  protect,
  changePassword
);

export default router;