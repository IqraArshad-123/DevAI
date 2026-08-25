import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

export type AIResponseStyle =
  | "balanced"
  | "concise"
  | "detailed"
  | "technical";

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY as string
  );

const model =
  genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
  });

// =====================================================
// BUILD AI PROMPT
// =====================================================

const buildPrompt = (
  message: string,
  responseStyle: AIResponseStyle = "balanced"
): string => {
  let styleInstruction = "";

  switch (responseStyle) {
    case "concise":
      styleInstruction =
        "Keep the response concise and direct. Avoid unnecessary explanations.";
      break;

    case "detailed":
      styleInstruction =
        "Give a detailed response with clear explanations and useful examples where appropriate.";
      break;

    case "technical":
      styleInstruction =
        "Respond in a technical developer-focused style. Prefer precise terminology, implementation details, and code examples when useful.";
      break;

    case "balanced":
    default:
      styleInstruction =
        "Give a balanced response that is clear, useful, and appropriately detailed.";
      break;
  }

  return `
You are Dev AI, an AI developer assistant.

Response style:
${styleInstruction}

User message:
${message}
`;
};

// =====================================================
// NORMAL AI RESPONSE
// =====================================================

export const askAI = async (
  message: string,
  responseStyle: AIResponseStyle = "balanced"
): Promise<string> => {
  const prompt = buildPrompt(
    message,
    responseStyle
  );

  const result =
    await model.generateContent(
      prompt
    );

  const response =
    result.response;

  return response.text();
};

// =====================================================
// STREAMING AI RESPONSE
// =====================================================

export const streamAI = async (
  message: string,
  onChunk: (text: string) => void,
  responseStyle: AIResponseStyle = "balanced"
): Promise<void> => {
  const prompt = buildPrompt(
    message,
    responseStyle
  );

  const result =
    await model.generateContentStream(
      prompt
    );

  for await (
    const chunk of result.stream
  ) {
    const text =
      chunk.text();

    if (text) {
      onChunk(text);
    }
  }
};