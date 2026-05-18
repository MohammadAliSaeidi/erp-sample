import { LockServicePort } from "@/src/application/shared/lock-service/lock-service.port";
import { LockKeys } from "@/src/application/shared/lock-service/lock-service.registry";
import { buildReleaseLockUsecase } from "@/src/application/shared/lock-service/usecase/release-lock.usecase";
import { IEventPublisherPort } from "@/src/application/shared/ports/event-publisher.port";
import { buildEvent } from "@/src/domain/shared/events/build-event";
import { $brand } from "zod";

export const buildReleaseEditItemLockUsecase = (deps: {
  lockService: LockServicePort;
  eventPublisher: IEventPublisherPort;
}) =>
  buildReleaseLockUsecase({
    key: "item.release-edit-lock",
    requiredPermissions: ["items:update"],
    lockService: deps.lockService,
    buildLockKey: (storeId, entityId) => LockKeys.item(storeId, entityId),
    eventPublisher: deps.eventPublisher,
    emitEvents: true,
    eventFactory: {
      released: (ctx, input) =>
        buildEvent(
          "item.unlocked",
          {
            itemId: input.entityId,
            storeId: ctx.storeId,
            unlockedBy: String(ctx.adminId) as string & $brand<"AdminId">,
          },
          undefined,
        ),
      denied: (ctx, input) =>
        buildEvent(
          "item.unlock.denied",
          {
            storeId: ctx.storeId,
            itemId: input.entityId,
          },
          undefined,
        ),
    },
  });
