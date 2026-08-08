import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export const askAI = async (message: string): Promise<string> => {
  const result = await model.generateContent(message);

  const response = result.response;

  return response.text();
};