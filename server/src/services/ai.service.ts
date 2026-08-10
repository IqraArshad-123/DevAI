import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
});

// =====================================================
// NORMAL AI RESPONSE
// =====================================================

export const askAI = async (
  message: string
): Promise<string> => {
  const result = await model.generateContent(message);

  const response = result.response;

  return response.text();
};

// =====================================================
// STREAMING AI RESPONSE
// =====================================================

export const streamAI = async (
  message: string,
  onChunk: (text: string) => void
): Promise<void> => {
  const result = await model.generateContentStream(message);

  for await (const chunk of result.stream) {
    const text = chunk.text();

    if (text) {
      onChunk(text);
    }
  }
};