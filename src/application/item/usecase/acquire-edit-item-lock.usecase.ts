import { buildAcquireLockUsecase } from "@/src/application/shared/lock-service/usecase/acquire-lock.usecase";
import { LockKeys } from "@/src/application/shared/lock-service/lock-service.registry";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { buildEvent } from "@/src/domain/shared/events/build-event";
import { LockServicePort } from "@/src/application/shared/lock-service/lock-service.port";
import { IEventPublisherPort } from "@/src/application/shared/ports/event-publisher.port";
import { createItemLockInfrastructure } from "@/src/infrastructure/redis/item-lock-infrastructure";
import { DomainEvent } from "@/src/domain/shared/events/events.types";
import {
  LockResultFailure,
  LockResultOk,
} from "@/src/application/shared/lock-service/lock-service.types";
import { StoreId } from "@/src/domain/store/store-id";
import { ItemId } from "@/src/domain/item/item-id";
import { Brand, brand } from "@/lib/brand";

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
    buildLockKey: (storeId: StoreId, entityId: string) => {
      const itemId: ItemId = brand(entityId);
      return LockKeys.item(storeId, itemId);
    },

    eventFactory: {
      buildLockedEvent: (
        ctx: AuthContext,
        input,
        result: LockResultOk,
      ): DomainEvent<"item.locked"> =>
        buildEvent(
          "item.locked",
          {
            storeId: ctx.storeId,
            itemId: brand(input.entityId),
            lockedBy: brand(ctx.adminId),
            expiresAt: result.expiresAt,
            token: brand(result.lockToken),
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
            itemId: brand(input.entityId),
            requestedBy: brand(ctx.adminId),
            lockedBy: brand(result.lockedBy),
            expiresAt: result.expiresAt,
          },
          undefined,
        ),
    },
  });

const { lockService, eventPublisher } = createItemLockInfrastructure();

export const acquireEditItemLockUsecase = buildAcquireEditItemLockUsecase({
  lockService,
  events: eventPublisher,
});
