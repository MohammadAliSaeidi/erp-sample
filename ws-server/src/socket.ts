import { Server as HttpServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { resolveAuthContext } from "../../features/auth/index.js";

type JoinStorePayload = { storeId: string };
type JoinItemPayload = { storeId: string; itemId: string };
type JoinAdminPayload = { adminId: string };

const storeRoom = (storeId: string) => `store:${storeId}`;
const itemRoom = (storeId: string, itemId: string) =>
  `store:${storeId}:item:${itemId}`;
const adminRoom = (adminId: string) => `admin:${adminId}`;

export function buildSocketServer(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, { cors: { origin: "*" } });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    // Verify token, fetch user permissions (e.g., via Redis or JWT decode)
    const authContext = await resolveAuthContext(token);

    if (!authContext) return next(new Error("Unauthorized"));

    socket.data.authContext = authContext; // Attach for later
    next();
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join-store", ({ storeId }: JoinStorePayload) => {
      socket.join(storeRoom(storeId));
    });

    socket.on("leave-store", ({ storeId }: JoinStorePayload) => {
      socket.leave(storeRoom(storeId));
    });

    socket.on("join-item", ({ storeId, itemId }: JoinItemPayload) => {
      socket.join(itemRoom(storeId, itemId));
    });

    socket.on("leave-item", ({ storeId, itemId }: JoinItemPayload) => {
      socket.leave(itemRoom(storeId, itemId));
    });

    socket.on("join-admin", ({ adminId }: JoinAdminPayload) => {
      socket.join(adminRoom(adminId));
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}
