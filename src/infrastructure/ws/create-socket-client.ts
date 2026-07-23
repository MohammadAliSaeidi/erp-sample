import { io, type Socket } from "socket.io-client";

export function createSocketClient(token: string): Socket {
  return io(process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001", {
    autoConnect: false,
    auth: { token },
    transports: ["websocket", "polling"],
  });
}

export function joinStoreRoom(socket: Socket, storeId: string) {
  if (!storeId) return;
  socket.emit("join-store", { storeId });
}

export function leaveStoreRoom(socket: Socket, storeId: string) {
  if (!storeId) return;
  socket.emit("leave-store", { storeId });
}

export function joinItemRoom(socket: Socket, storeId: string, itemId: string) {
  if (!storeId || !itemId) return;
  socket.emit("join-item", { storeId, itemId });
}

export function leaveItemRoom(socket: Socket, storeId: string, itemId: string) {
  if (!storeId || !itemId) return;
  socket.emit("leave-item", { storeId, itemId });
}
