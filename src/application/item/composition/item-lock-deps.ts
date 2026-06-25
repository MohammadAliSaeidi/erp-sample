import type { AcquireLockUsecaseDeps } from "@/src/application/shared/lock-service/usecase/acquire-lock.usecase";
import type { RefreshLockUsecaseDeps } from "@/src/application/shared/lock-service/usecase/refresh-lock.usecase";
import type { ReleaseLockUsecaseDeps } from "@/src/application/shared/lock-service/usecase/release-lock.usecase";
import { LockKeys } from "@/src/application/shared/lock-service/lock-service.registry";
import { buildEvent } from "@/src/domain/shared/events/build-event";
import { StoreId } from "@/src/domain/store/store-id";
import { buildRedisEventPublisher } from "@/src/infrastructure/redis/redis-event-publisher.adapter";
import { buildRedisLockService } from "@/src/infrastructure/redis/redis-lock-service.adapter";
import { redisClient } from "@/src/infrastructure/redis/redis-client";
import { brand } from "@/lib/brand";

const lockService = buildRedisLockService(redisClient);
const eventPublisher = buildRedisEventPublisher(redisClient);

const buildItemLockKey = (storeId: StoreId, entityId: string) =>
  LockKeys.item(storeId, brand(entityId));

export const itemLockDeps = {
  acquire: {
    lockService,
    eventPublisher,
    emitEvents: true,
    buildLockKey: buildItemLockKey,
    eventFactory: {
      buildLockedEvent: (context, input, result) =>
        buildEvent(
          "item.locked",
          {
            storeId: context.storeId,
            itemId: input.entityId,
            lockedBy: context.adminId,
            expiresAt: result.expiresAt,
            token: result.lockToken,
          },
          undefined,
        ),
      buildDeniedEvent: (context, input, result) =>
        buildEvent(
          "item.lock.denied",
          {
            storeId: brand<string, StoreId>(context.storeId),
            itemId: input.entityId,
            requestedBy: brand(context.adminId),
            lockedBy: result.lockedBy,
            expiresAt: result.expiresAt,
          },
          undefined,
        ),
    },
  } satisfies AcquireLockUsecaseDeps<"item.locked", "item.lock.denied">,
  refresh: {
    lockService,
    buildLockKey: buildItemLockKey,
  } satisfies RefreshLockUsecaseDeps,
  release: {
    lockService,
    eventPublisher,
    emitEvents: true,
    buildLockKey: buildItemLockKey,
    eventFactory: {
      released: (context, input) =>
        buildEvent(
          "item.unlocked",
          {
            itemId: input.entityId,
            storeId: context.storeId,
            unlockedBy: brand(context.adminId),
          },
          undefined,
        ),
      denied: (context, input) =>
        buildEvent(
          "item.unlock.denied",
          {
            storeId: context.storeId,
            itemId: input.entityId,
          },
          undefined,
        ),
    },
  } satisfies ReleaseLockUsecaseDeps<"item.unlocked", "item.unlock.denied">,
};
