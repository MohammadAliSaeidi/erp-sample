import { Redis } from "ioredis";
import { Server as SocketIOServer } from "socket.io";
import { config } from "../config.js";

type DomainEvent = {
  type: string;
  version: number;
  payload: {
    storeId?: string;
    itemId?: string;
    adminId?: string;
    [k: string]: unknown;
  };
  meta: {
    actorAdminId: string;
    occurredAt: string;
  };
};

export function buildRedisEventSubscriber(subscriber: Redis, io: SocketIOServer) {
  return {
    async start() {
      await subscriber.subscribe(config.domainEventsChannel);

      subscriber.on("message", (channel, message) => {
        if (channel !== config.domainEventsChannel) return;

        try {
          const event = JSON.parse(message) as DomainEvent;
          const { storeId, itemId, adminId } = event.payload ?? {};

          if (storeId && itemId) {
            io.to(`store:${storeId}:item:${itemId}`).emit(event.type, event.payload);
            return;
          }

          if (storeId) {
            io.to(`store:${storeId}`).emit(event.type, event.payload);
            return;
          }

          if (adminId) {
            io.to(`admin:${adminId}`).emit(event.type, event.payload);
            return;
          }

          // Avoid global emit unless explicitly intended
          console.warn(`[ws] dropped non-scoped event type=${event.type}`);
        } catch (err) {
          console.error("[ws] parse error:", err);
        }
      });

      console.log(`Subscribed to Redis channel: ${config.domainEventsChannel}`);
    },
  };
}
