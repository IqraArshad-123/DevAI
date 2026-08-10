import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import aiRoutes from "./routes/ai.routes";
import historyRoutes from "./routes/history.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Dev AI Backend is Running Successfully!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/history", historyRoutes);

export default app;