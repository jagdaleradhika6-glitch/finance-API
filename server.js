require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const { errorResponse } = require("./utils/response");
const logger = require("./utils/logger");

const app = express();

// ─── Database ───────────────────────────────────────────────
//connectDB();

// ─── Core Middleware ─────────────────────────────────────────
app.use(express.json());                  // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));                   // HTTP request logging

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Finance Backend API is running 🚀",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      records: "/api/records",
      dashboard: "/api/dashboard",
    },
  });
});

// ─── 404 Handler ──────────────────────────────────────────────
app.use("*", (req, res) => {
  return errorResponse(res, 404, `Route '${req.originalUrl}' not found`);
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error("Unhandled error:", err.message);
  return errorResponse(
    res,
    err.status || 500,
    err.message || "Internal server error"
  );
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.success(`Server running on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
});
