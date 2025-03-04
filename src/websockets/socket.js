const { Server } = require("socket.io");

let io;
module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: { origin: "*" },
      transports: ["websocket", "polling"], // Ensure multiple transport options
    });

    io.on("connection", (socket) => {
      console.log(`✅ User connected: ${socket.id}`);

      socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.id}`);
      });

      socket.on("error", (err) => {
        console.error("❌ Socket.IO error:", err);
      });
    });
  },
  emit: (event, data) => {
    if (io) {
      io.emit(event, data);
    }
  },
};
