import { z } from "zod";
import { LockServicePort } from "@/application/shared/lock-service/lock-service.port";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { IEventPublisherPort } from "@/application/shared/ports/event-publisher.port";
import { buildEvent } from "@/domain/shared/events/build-event";
import { buildRedisEventPublisher } from "@/infrastructure/redis/redis-event-publisher.adapter";
import { buildRedisLockService } from "@/infrastructure/redis/redis-lock-service.adapter";
import { redisClient } from "@/infrastructure/redis/redis-client";
import { LockKeys } from "@/application/shared/lock-service/lock-service.registry";

/** Input schema for end edit. */
const inputSchema = z.object({
  itemId: z.string().min(1),
});

/** Dependencies for end edit use case. */
export type EndEditItemDeps = {
  lockService: LockServicePort;
  events: IEventPublisherPort;
};

/**
 * Use case: release an edit lock.
 * Emits: item.unlocked
 */
export const buildEndEditItemUsecase = (deps: EndEditItemDeps) =>
  authenticatedUsecaseFactory({
    key: "item.end-edit",
    requiredPermissions: ["items:update"],
    auth: "required",
    inputSchema,
    execute: async ({
      input,
      authContext: { adminId, storeId },
    }): Promise<{ released: boolean }> => {
      const key = LockKeys.item(storeId, input.itemId);
      const released: boolean = await deps.lockService.release(key, adminId);

      if (released) {
        await deps.events.publish(
          buildEvent(
            "item.unlocked",
            { itemId: input.itemId, unlockedBy: adminId, storeId },
            adminId,
          ),
        );
      }

      return { released };
    },
  });

export const endEditItemUsecase = buildEndEditItemUsecase({
  lockService: buildRedisLockService(redisClient),
  events: buildRedisEventPublisher(redisClient),
});
