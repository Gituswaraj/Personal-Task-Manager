import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/tasks", taskRoutes);

// ── Error Handler (must be after routes) ─────────────────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Tasks API: http://localhost:${PORT}/api/tasks`);
});

export default app;
