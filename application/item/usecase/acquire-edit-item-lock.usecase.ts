import { buildAcquireLockUsecase } from "@/application/shared/lock-service/usecase/acquire-lock.usecase";
import { LockKeys } from "@/application/shared/lock-service/lock-service.registry";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { buildEvent } from "@/domain/shared/events/build-event";
import {
  LockResultFailure,
  LockResultOk,
  LockServicePort,
} from "@/application/shared/lock-service/lock-service.port";
import { IEventPublisherPort } from "@/application/shared/ports/event-publisher.port";
import { buildRedisLockService } from "@/infrastructure/redis/redis-lock-service.adapter";
import { buildRedisEventPublisher } from "@/infrastructure/redis/redis-event-publisher.adapter";
import { redisClient } from "@/infrastructure/redis/redis-client";
import { DomainEvent } from "@/domain/shared/events/events.types";

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
            token: result.token,
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

export const beginEditItemUsecase = buildAcquireEditItemLockUsecase({
  lockService: buildRedisLockService(redisClient),
  events: buildRedisEventPublisher(redisClient),
});
