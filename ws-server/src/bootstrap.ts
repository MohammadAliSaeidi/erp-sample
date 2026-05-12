import { Server as HttpServer } from "node:http";
import { buildSocketServer } from "./socket.js";
import { buildRedisSubscriber } from "./redis.js";
import { buildRedisEventSubscriber } from "./adapters/redis-event-subscriber.adapter.js";

export async function bootstrap(httpServer: HttpServer) {
  const io = buildSocketServer(httpServer);

  const redisSubscriber = buildRedisSubscriber();

  const redisEventSubscriber = buildRedisEventSubscriber(redisSubscriber, io);
  await redisEventSubscriber.start();

  return { io, redisSubscriber };
}
