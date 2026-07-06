import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { db } from "./db/config.js";
import mainRouter from "./src/api/routes.js";
import { errorHandler } from "./src/middleware/error-handler.js";

const app = express();

// IMPORTANT: Render requires process.env.PORT
const port = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload folder
const uploadPath = path.join(__dirname, "uploads");

console.log("Serving uploads from:", uploadPath);

// Static files
app.use("/uploads", express.static(uploadPath));

// Health check (IMPORTANT for Render debugging)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api", mainRouter);

// Error handler (MUST be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    const connection = await db.getConnection();
    console.log("Database connection established successfully.");
    connection.release();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(
      "Failed to connect to the database. Server not started.",
      error.message
    );
    process.exit(1);
  }
};

startServer();