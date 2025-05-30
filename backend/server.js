const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
const envPath = path.resolve(__dirname, ".env");
console.log("Loading .env file from:", envPath);
dotenv.config({ path: envPath });

// Check required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET", "WEATHER_API_KEY"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    "Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  console.error("Please create a .env file with these variables");
  console.error("Current environment variables:", {
    MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Not set",
    JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not set",
    WEATHER_API_KEY: process.env.WEATHER_API_KEY ? "Set" : "Not set",
    PORT: process.env.PORT || "5000 (default)",
  });
  process.exit(1);
}

// Create Express app
const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // Vite default dev server
  "http://localhost:3000", // Alternative dev server
  "http://127.0.0.1:5173", // Vite default dev server (IP)
  "http://127.0.0.1:3000", // Alternative dev server (IP)
  "https://d4xxkt7f-5173.inc1.devtunnels.ms/",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.some(
        (allowedOrigin) =>
          origin === allowedOrigin || origin.endsWith(".devtunnels.ms")
      )
    ) {
      callback(null, true);
    } else {
      console.warn(`Blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  exposedHeaders: ["Authorization"],
  maxAge: 86400, // 24 hours
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Connect to MongoDB
console.log("Attempting to connect to MongoDB...");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/weather", require("./routes/weatherRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
