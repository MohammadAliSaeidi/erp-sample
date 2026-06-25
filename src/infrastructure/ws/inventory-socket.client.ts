import { io, type Socket } from "socket.io-client";

const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001";

export function createInventorySocket(accessToken: string): Socket {
  return io(wsUrl, {
    auth: { token: accessToken },
    autoConnect: true,
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

export type ItemLockEventPayload = {
  storeId?: string;
  itemId?: string;
  lockedBy?: string;
  requestedBy?: string;
  expiresAt?: string;
  token?: string;
  unlockedBy?: string;
};
