import { buildAcquireLockUsecase } from "@/application/shared/lock-service/usecase/acquire-lock.usecase";
import { LockKeys } from "@/application/shared/lock-service/lock-service.registry";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { buildEvent } from "@/domain/shared/events/build-event";
import { LockServicePort } from "@/application/shared/lock-service/lock-service.port";
import { IEventPublisherPort } from "@/application/shared/ports/event-publisher.port";
import { buildRedisLockService } from "@/infrastructure/redis/redis-lock-service.adapter";
import { buildRedisEventPublisher } from "@/infrastructure/redis/redis-event-publisher.adapter";
import { redisClient } from "@/infrastructure/redis/redis-client";
import { generateLockToken } from "@/application/shared/lock-service/generate-lock-token";

export type AcquireEditItemLockDeps = {
  lockService: LockServicePort;
  events: IEventPublisherPort;
};

export const buildAcquireEditItemLockUsecase = (
  deps: AcquireEditItemLockDeps,
) =>
  buildAcquireLockUsecase({
    key: "item.acquire-edit",
    requiredPermissions: ["items:update"],
    lockService: deps.lockService,
    emitEvents: true,
    eventPublisher: deps.events,
    buildLockKey: (storeId: string, entityId: string) =>
      LockKeys.item(storeId, entityId),

    eventFactory: {
      locked: (ctx: AuthContext, input, result) =>
        buildEvent(
          "item.locked",
          {
            storeId: String(ctx.storeId),
            itemId: input.entityId,
            lockedBy: String(ctx.adminId),
            expiresAt: result.expiresAt,
            token: result.token,
          },
          undefined,
        ),

      denied: (ctx: AuthContext, input, result) =>
        buildEvent(
          "item.lock.denied",
          {
            storeId: ctx.storeId,
            itemId: input.entityId,
            requestedBy: ctx.adminId,
            lockedBy: result.lockedBy,
            expiresAt: result.expiresAt,
          },
          undefined,
        ),
    },
  });

export const beginEditItemUsecase = buildAcquireEditItemLockUsecase({
  lockService: buildRedisLockService(redisClient),
  events: buildRedisEventPublisher(redisClient),
});
