import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import aiRoutes from "./routes/ai.routes";
import historyRoutes from "./routes/history.routes";
import noteRoutes from "./routes/note.routes";

const app = express();

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
  })
);

// =====================================================
// BASIC SECURITY HEADERS
// =====================================================

app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// =====================================================
// REQUEST BODY SIZE LIMIT
// =====================================================

app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Dev AI Backend is Running Successfully!",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/history", historyRoutes);

app.use("/api/notes", noteRoutes);

export default app;
