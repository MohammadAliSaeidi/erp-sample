import type { LockServicePort } from "@/src/application/shared/lock-service/lock-service.port";
import type { IEventPublisherPort } from "@/src/application/shared/ports/event-publisher.port";
import { buildRedisEventPublisher } from "@/src/infrastructure/redis/redis-event-publisher.adapter";
import { buildRedisLockService } from "@/src/infrastructure/redis/redis-lock-service.adapter";
import { redisClient } from "@/src/infrastructure/redis/redis-client";
import type { Redis } from "ioredis";

export type ItemLockInfrastructure = {
  lockService: LockServicePort;
  eventPublisher: IEventPublisherPort;
};

export function createItemLockInfrastructure(
  redis: Redis = redisClient,
): ItemLockInfrastructure {
  return {
    lockService: buildRedisLockService(redis),
    eventPublisher: buildRedisEventPublisher(redis),
  };
}
