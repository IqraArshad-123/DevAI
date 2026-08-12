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

const router = Router();

// =====================================================
// NORMAL CHAT
// =====================================================

router.post(
  "/chat",
  protect,
  chatWithAI
);

// =====================================================
// STREAMING CHAT
// =====================================================

router.post(
  "/chat/stream",
  protect,
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
  regenerateMessage
);

// =====================================================
// EDIT USER MESSAGE
// =====================================================

router.post(
  "/edit-message",
  protect,
  editMessage
);


export default router;