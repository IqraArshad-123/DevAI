import { Request, Response } from "express";
import Conversation from "../models/Conversation";

// Get all conversations for logged-in user
export const getHistory = async (
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
      .select("title createdAt updatedAt messages");

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get History Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching history",
    });
  }
};

// Get one conversation
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
    console.error("Get Conversation Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching conversation",
    });
  }
};

// Delete one conversation
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

    const conversation = await Conversation.findOneAndDelete({
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
    console.error("Delete Conversation Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting conversation",
    });
  }
};

