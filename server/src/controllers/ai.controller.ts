import { Request, Response } from "express";
import { askAI, streamAI } from "../services/ai.service";
import Conversation from "../models/Conversation";

// =====================================================
// SEND MESSAGE TO AI
// =====================================================

export const chatWithAI = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { message, conversationId } = req.body;

    // =================================================
    // CHECK MESSAGE
    // =================================================

    if (!message || typeof message !== "string") {
      res.status(400).json({
        success: false,
        message: "Message is required",
      });
      return;
    }

    // =================================================
    // GET LOGGED-IN USER
    // =================================================

    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // =================================================
    // GET AI RESPONSE
    // =================================================

    const answer = await askAI(message);

    // =================================================
    // EXISTING CONVERSATION
    // =================================================

    if (conversationId) {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        user: userId,
      });

      if (!conversation) {
        res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
        return;
      }

      // Add user message
      conversation.messages.push({
        role: "user",
        content: message,
        createdAt: new Date(),
      });

      // Add AI message
      conversation.messages.push({
        role: "assistant",
        content: answer,
        createdAt: new Date(),
      });

      await conversation.save();

      res.status(200).json({
        success: true,
        message: "AI response generated successfully",
        answer,
        conversationId: conversation._id,
      });

      return;
    }

    // =================================================
    // CREATE NEW CONVERSATION
    // =================================================

    const title =
      message.length > 50
        ? `${message.substring(0, 50)}...`
        : message;

    const conversation = await Conversation.create({
      user: userId,
      title,
      messages: [
        {
          role: "user",
          content: message,
          createdAt: new Date(),
        },
        {
          role: "assistant",
          content: answer,
          createdAt: new Date(),
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "AI response generated successfully",
      answer,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while communicating with AI",
    });
  }
};

// =====================================================
// STREAM AI RESPONSE
// =====================================================

export const streamChatWithAI = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { message, conversationId } = req.body;

    // =================================================
    // CHECK MESSAGE
    // =================================================

    if (!message || typeof message !== "string") {
      res.status(400).json({
        success: false,
        message: "Message is required",
      });
      return;
    }

    // =================================================
    // GET LOGGED-IN USER
    // =================================================

    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // =================================================
    // EXISTING CONVERSATION CHECK
    // =================================================

    let conversation = null;

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        user: userId,
      });

      if (!conversation) {
        res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
        return;
      }
    }

    // =================================================
    // SSE HEADERS
    // =================================================

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();

    // =================================================
    // SEND START EVENT
    // =================================================

    res.write(
      `data: ${JSON.stringify({
        type: "start",
      })}\n\n`
    );

    // =================================================
    // COLLECT COMPLETE AI RESPONSE
    // =================================================

    let fullAnswer = "";

    // =================================================
    // STREAM GEMINI RESPONSE
    // =================================================

    await streamAI(message, (chunk) => {
      fullAnswer += chunk;

      res.write(
        `data: ${JSON.stringify({
          type: "chunk",
          content: chunk,
        })}\n\n`
      );
    });

    // =================================================
    // SAVE CONVERSATION
    // =================================================

    if (conversation) {
      // Existing conversation

      conversation.messages.push({
        role: "user",
        content: message,
        createdAt: new Date(),
      });

      conversation.messages.push({
        role: "assistant",
        content: fullAnswer,
        createdAt: new Date(),
      });

      await conversation.save();

      // Tell frontend conversation is complete
      res.write(
        `data: ${JSON.stringify({
          type: "done",
          conversationId: conversation._id,
        })}\n\n`
      );
    } else {
      // =================================================
      // CREATE NEW CONVERSATION
      // =================================================

      const title =
        message.length > 50
          ? `${message.substring(0, 50)}...`
          : message;

      const newConversation = await Conversation.create({
        user: userId,
        title,
        messages: [
          {
            role: "user",
            content: message,
            createdAt: new Date(),
          },
          {
            role: "assistant",
            content: fullAnswer,
            createdAt: new Date(),
          },
        ],
      });

      res.write(
        `data: ${JSON.stringify({
          type: "done",
          conversationId: newConversation._id,
        })}\n\n`
      );
    }

    // =================================================
    // END STREAM
    // =================================================

    res.write(
      `data: ${JSON.stringify({
        type: "end",
      })}\n\n`
    );

    res.end();
  } catch (error) {
    console.error("Streaming AI Error:", error);

    // Agar stream start ho chuka hai
    // to JSON response nahi bhej sakte.
    // SSE error event bhejenge.

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message:
          "Something went wrong while communicating with AI",
      });

      return;
    }

    res.write(
      `data: ${JSON.stringify({
        type: "error",
        message:
          "Something went wrong while communicating with AI",
      })}\n\n`
    );

    res.end();
  }
};

// =====================================================
// GET ALL USER CONVERSATIONS
// =====================================================

export const getConversations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const conversations = await Conversation.find({
      user: userId,
    })
      .sort({ updatedAt: -1 })
      .select("title messages createdAt updatedAt");

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error(
      "Get Conversations Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching conversations",
    });
  }
};

// =====================================================
// GET SINGLE CONVERSATION
// =====================================================

export const getConversation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const conversation = await Conversation.findOne({
      _id: id,
      user: userId,
    });

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error(
      "Get Conversation Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching conversation",
    });
  }
};

// =====================================================
// DELETE CONVERSATION
// =====================================================

export const deleteConversation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const conversation =
      await Conversation.findOneAndDelete({
        _id: id,
        user: userId,
      });

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Conversation Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while deleting conversation",
    });
  }
};

// =====================================================
// REGENERATE LAST AI RESPONSE
// =====================================================

export const regenerateMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { conversationId } = req.body;

    // =================================================
    // CHECK CONVERSATION ID
    // =================================================

    if (!conversationId) {
      res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
      return;
    }

    // =================================================
    // GET LOGGED-IN USER
    // =================================================

    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // =================================================
    // FIND CONVERSATION
    // =================================================

    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: userId,
    });

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
      return;
    }

    // =================================================
    // FIND LAST USER MESSAGE
    // =================================================

    const lastUserMessageIndex =
      conversation.messages
        .map((msg) => msg.role)
        .lastIndexOf("user");

    if (lastUserMessageIndex === -1) {
      res.status(400).json({
        success: false,
        message: "No user message found to regenerate",
      });
      return;
    }

    const lastUserMessage =
      conversation.messages[lastUserMessageIndex];

    // =================================================
    // REMOVE OLD AI RESPONSE
    // =================================================

    conversation.messages =
      conversation.messages.slice(
        0,
        lastUserMessageIndex + 1
      ) as typeof conversation.messages;

    // =================================================
    // GENERATE NEW AI RESPONSE
    // =================================================

    const answer = await askAI(
      lastUserMessage.content
    );

    // =================================================
    // ADD NEW AI RESPONSE
    // =================================================

    conversation.messages.push({
      role: "assistant",
      content: answer,
      createdAt: new Date(),
    });

    await conversation.save();

    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({
      success: true,
      message: "Response regenerated successfully",
      answer,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error(
      "Regenerate Message Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while regenerating the response",
    });
  }
};


// =====================================================
// EDIT USER MESSAGE
// =====================================================

export const editMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      conversationId,
      messageId,
      message,
    } = req.body;

    // =================================================
    // CHECK INPUT
    // =================================================

    if (!conversationId) {
      res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
      return;
    }

    if (!messageId) {
      res.status(400).json({
        success: false,
        message: "Message ID is required",
      });
      return;
    }

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Message is required",
      });
      return;
    }

    // =================================================
    // GET LOGGED-IN USER
    // =================================================

    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // =================================================
    // FIND CONVERSATION
    // =================================================

    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: userId,
    });

    if (!conversation) {
      res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
      return;
    }

    // =================================================
    // FIND MESSAGE
    // =================================================

    const messageIndex =
      conversation.messages.findIndex(
        (msg) =>
          msg._id?.toString() === messageId
      );

    if (messageIndex === -1) {
      res.status(404).json({
        success: false,
        message: "Message not found",
      });
      return;
    }

    // =================================================
    // ONLY USER MESSAGE CAN BE EDITED
    // =================================================

    if (
      conversation.messages[messageIndex].role !==
      "user"
    ) {
      res.status(400).json({
        success: false,
        message: "Only user messages can be edited",
      });
      return;
    }

    // =================================================
    // UPDATE USER MESSAGE
    // =================================================

    const updatedMessage = message.trim();

    conversation.messages[messageIndex].content =
      updatedMessage;

    conversation.messages[messageIndex].createdAt =
      new Date();

    // =================================================
    // REMOVE EVERYTHING AFTER EDITED MESSAGE
    // =================================================

    conversation.messages =
      conversation.messages.slice(
        0,
        messageIndex + 1
      ) as typeof conversation.messages;

    // =================================================
    // GENERATE NEW AI RESPONSE
    // =================================================

    const answer = await askAI(
      updatedMessage
    );

    // =================================================
    // ADD NEW AI RESPONSE
    // =================================================

    conversation.messages.push({
      role: "assistant",
      content: answer,
      createdAt: new Date(),
    });

    // =================================================
    // UPDATE TITLE IF THIS IS FIRST MESSAGE
    // =================================================

    if (messageIndex === 0) {
      conversation.title =
        updatedMessage.length > 50
          ? `${updatedMessage.substring(0, 50)}...`
          : updatedMessage;
    }

    await conversation.save();

    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({
      success: true,
      message: "Message edited successfully",
      answer,
      conversationId: conversation._id,
      conversation:
        conversation,
    });
  } catch (error) {
    console.error(
      "Edit Message Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Something went wrong while editing the message",
    });
  }
};