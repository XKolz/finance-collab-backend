require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

// Import Local Modules
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const { init } = require("./websockets/socket");

// Initialize Express and HTTP Server
const app = express();
const server = http.createServer(app);

// Initialize Prisma Client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// Initialize WebSockets
init(server);

// Database Connection Handling
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL database successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();

// Gracefully Close Prisma Connection on Exit
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🔌 Disconnected from PostgreSQL database.");
  process.exit(0);
});

// Only start server if not in test mode
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export the Express app for testing
module.exports = { app, server };
