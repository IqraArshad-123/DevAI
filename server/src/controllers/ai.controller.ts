import { Request, Response } from "express";
import { askAI } from "../services/ai.service";

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

    const answer = await askAI(message);

    res.status(200).json({
      success: true,
      message: "AI response generated successfully",
      answer,
    });
  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while communicating with AI",
    });
  }
};