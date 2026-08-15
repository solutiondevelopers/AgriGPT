import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import authRoutes from "./src/server/routes/authRoutes";
import farmRoutes from "./src/server/routes/farmRoutes";
import aiRoutes from "./src/server/routes/aiRoutes";
import orderRoutes from "./src/server/routes/orderRoutes";
import { connectDB } from "./src/server/config/db";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to MongoDB
  await connectDB();

  app.use(express.json());

  // API endpoints
  app.use("/api/auth", authRoutes);
  app.use("/api/farms", farmRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api", aiRoutes);

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
