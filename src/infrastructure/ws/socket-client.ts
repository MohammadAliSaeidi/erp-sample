import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001");

export function joinStoreRoom(storeId: string) {
  if (!storeId) return;
  socket.emit("join-store", { storeId });
}

export function leaveStoreRoom(storeId: string) {
  if (!storeId) return;
  socket.emit("leave-store", { storeId });
}

export function joinItemRoom(storeId: string, itemId: string) {
  if (!storeId || !itemId) return;
  socket.emit("join-item", { storeId, itemId });
}

export function leaveItemRoom(storeId: string, itemId: string) {
  if (!storeId || !itemId) return;
  socket.emit("leave-item", { storeId, itemId });
}

export default socket;
