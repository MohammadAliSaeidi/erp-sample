import { Server as HttpServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";

export function buildSocketServer(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });

    /**
     * Optional: if clients want store-specific rooms
     * client emits: socket.emit("join-store", { storeId: "123" })
     */
    socket.on("join-store", ({ storeId }: { storeId: string }) => {
      const room = `store:${storeId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    socket.on("leave-store", ({ storeId }: { storeId: string }) => {
      const room = `store:${storeId}`;
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
    });
  });

  return io;
}
