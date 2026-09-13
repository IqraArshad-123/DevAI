import { Router } from "express";

import {
  chatWithAI,
  streamChatWithAI,
  getConversations,
  getConversation,
  deleteConversation,
  regenerateMessage,
  editMessage,
} from "../controllers/ai.controller";

import { protect } from "../middleware/auth.middleware";
import { aiRateLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

// =====================================================
// NORMAL CHAT
// =====================================================

router.post(
  "/chat",
  protect,
  aiRateLimiter,
  chatWithAI
);

// =====================================================
// STREAMING CHAT
// =====================================================

router.post(
  "/chat/stream",
  protect,
  aiRateLimiter,
  streamChatWithAI
);

// =====================================================
// GET ALL CONVERSATIONS
// =====================================================

router.get(
  "/conversations",
  protect,
  getConversations
);

// =====================================================
// GET SINGLE CONVERSATION
// =====================================================

router.get(
  "/conversations/:id",
  protect,
  getConversation
);

// =====================================================
// DELETE CONVERSATION
// =====================================================

router.delete(
  "/conversations/:id",
  protect,
  deleteConversation
);

// =====================================================
// REGENERATE AI RESPONSE
// =====================================================

router.post(
  "/regenerate",
  protect,
  aiRateLimiter,
  regenerateMessage
);

// =====================================================
// EDIT USER MESSAGE
// =====================================================

router.post(
  "/edit-message",
  protect,
  aiRateLimiter,
  editMessage
);

export default router;