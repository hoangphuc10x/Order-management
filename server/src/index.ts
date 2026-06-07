import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import { connectDB, disconnectDB } from "./config/Database";
import { setupSocket } from "./sockets/socket";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected.");

    const server = http.createServer(app);
    setupSocket(server);

    server.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );

    process.on("SIGINT", async () => {
      console.log("🛑 Server shutting down...");
      await disconnectDB();
      server.close(() => {
        console.log("✅ Server closed.");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
