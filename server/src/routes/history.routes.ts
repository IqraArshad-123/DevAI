import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getHistory,
  getConversation,
  deleteConversation,
} from "../controllers/history.controller";

const router = Router();

// Get all conversations
router.get("/", protect, getHistory);

// Get one conversation
router.get("/:id", protect, getConversation);

// Delete one conversation
router.delete("/:id", protect, deleteConversation);

export default router;