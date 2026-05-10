import { io } from "./socket.js";
import { buildRedisEventSubscriber } from "./adapters/redis-event-subscriber.adapter.js";
import { buildRedisClient } from "./redis.js";

export async function bootstrap() {
  const redis = buildRedisClient();
  const subscriber = buildRedisEventSubscriber(redis);

  await subscriber.subscribe((event) => {
    const storeId =
      typeof event.payload === "object" &&
      event.payload !== null &&
      "storeId" in event.payload &&
      typeof event.payload.storeId === "string"
        ? event.payload.storeId
        : undefined;

    if (storeId) {
      io.to(`store:${storeId}`).emit("domain:event", event);
      return;
    }

    io.emit("domain:event", event);
  });

  console.log("[ws] subscribed to domain-events");
}
