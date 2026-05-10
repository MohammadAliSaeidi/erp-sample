import { Server } from "socket.io";
import { httpServer } from "./http.js";
import { config } from "./config.js";

export const io = new Server(httpServer, {
  cors: { origin: config.corsOrigin },
});

io.on("connection", (socket) => {
  console.log(`[ws] client connected: ${socket.id}`);

  socket.emit("server:hello", {
    message: "connected to ws-server",
    socketId: socket.id,
    connectedAt: new Date().toISOString(),
  });

  socket.on("disconnect", (reason) => {
    console.log(`[ws] client disconnected: ${socket.id}, reason: ${reason}`);
  });

  socket.on("store:join", (storeId: string) => {
    if (!storeId || typeof storeId !== "string") return;
    socket.join(`store:${storeId}`);
    console.log(`[ws] socket ${socket.id} joined store:${storeId}`);
  });
});
