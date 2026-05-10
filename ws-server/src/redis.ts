import { Redis } from "ioredis";

export function buildRedisClient() {
  const url = process.env.REDIS_URL ?? "redis://localhost:6379";
  return new Redis(url);
}
