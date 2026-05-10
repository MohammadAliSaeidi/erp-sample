import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001");

socket.on("domain:event", (event) => {
  console.log("received domain event", event);
});

export function joinStoreRoom(storeId: string) {
  if (!storeId) return;
  socket.emit("store:join", storeId);
}

export default socket;
