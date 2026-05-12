import { Redis } from "ioredis";
import { config } from "./config.js";

export function buildRedisClient() {
  return new Redis(config.redisUrl);
}

export function buildRedisSubscriber() {
  return new Redis(config.redisUrl);
}

export function buildRedisPublisher() {
  return new Redis(config.redisUrl);
}
