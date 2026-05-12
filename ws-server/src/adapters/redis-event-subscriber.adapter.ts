import { Redis } from "ioredis";
import { Server as SocketIOServer } from "socket.io";
import { config } from "../config.js";

type DomainEvent = {
  type: string;
  version: number;
  payload: Record<string, unknown>;
  meta: {
    actorAdminId: string;
    occurredAt: string;
  };
};

export function buildRedisEventSubscriber(
  subscriber: Redis,
  io: SocketIOServer,
) {
  return {
    async start() {
      await subscriber.subscribe(config.domainEventsChannel);

      subscriber.on("message", (channel, message) => {
        if (channel !== config.domainEventsChannel) return;

        try {
          const event = JSON.parse(message) as DomainEvent;

          console.log("Received domain event:", event);

          const storeId = event.payload?.storeId;

          if (typeof storeId === "string" && storeId.length > 0) {
            console.log(`Broadcasting ${event.type} to room store:${storeId}`);
            io.to(`store:${storeId}`).emit(event.type, event.payload);
          } else {
            console.log(`Broadcasting ${event.type} globally`);
            io.emit(event.type, event.payload);
          }
        } catch (error) {
          console.error("Failed to parse Redis message:", error);
        }
      });

      console.log(`Subscribed to Redis channel: ${config.domainEventsChannel}`);
    },
  };
}
