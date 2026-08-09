import { Request, Response } from "express";
import { askAI } from "../services/ai.service";
import Conversation from "../models/Conversation";

export const chatWithAI = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({
        success: false,
        message: "Message is required",
      });
      return;
    }

    // Get logged-in user's ID from protect middleware
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // Get AI response
    const answer = await askAI(message);

    // Create a simple title from the first user message
    const title =
      message.length > 50
        ? `${message.substring(0, 50)}...`
        : message;

    // Save conversation in MongoDB
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
      message: "Something went wrong while communicating with AI",
    });
  }
};