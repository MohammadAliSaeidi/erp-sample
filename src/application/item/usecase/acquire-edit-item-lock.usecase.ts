import { buildAcquireLockUsecase } from "@/src/application/shared/lock-service/usecase/acquire-lock.usecase";
import { LockKeys } from "@/src/application/shared/lock-service/lock-service.registry";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { buildEvent } from "@/src/domain/shared/events/build-event";
import { LockServicePort } from "@/src/application/shared/lock-service/lock-service.port";
import { IEventPublisherPort } from "@/src/application/shared/ports/event-publisher.port";
import { buildRedisLockService } from "@/src/infrastructure/redis/redis-lock-service.adapter";
import { buildRedisEventPublisher } from "@/src/infrastructure/redis/redis-event-publisher.adapter";
import { redisClient } from "@/src/infrastructure/redis/redis-client";
import { DomainEvent } from "@/src/domain/shared/events/events.types";
import {
  LockResultFailure,
  LockResultOk,
} from "@/src/application/shared/lock-service/lock-service.types";
import { StoreId } from "@/src/domain/store/store-id";

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
    buildLockKey: (storeId: StoreId, entityId: string) =>
      LockKeys.item(storeId, entityId),

    eventFactory: {
      buildLockedEvent: (
        ctx: AuthContext,
        input,
        result: LockResultOk,
      ): DomainEvent<"item.locked"> =>
        buildEvent(
          "item.locked",
          {
            storeId: String(ctx.storeId),
            itemId: input.entityId,
            lockedBy: String(ctx.adminId),
            expiresAt: result.expiresAt,
            token: result.lockToken,
          },
          undefined,
        ),

      buildDeniedEvent: (
        ctx: AuthContext,
        input,
        result: LockResultFailure,
      ): DomainEvent<"item.lock.denied"> =>
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

export const acquireEditItemLockUsecase = buildAcquireEditItemLockUsecase({
  lockService: buildRedisLockService(redisClient),
  events: buildRedisEventPublisher(redisClient),
});
