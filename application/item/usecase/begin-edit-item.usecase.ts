import {
  LockResult,
  LockServicePort,
} from "@/application/shared/lock-service/lock-service.port";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { z } from "zod";
import { IEventPublisherPort } from "@/application/shared/ports/event-publisher.port";
import { buildEvent } from "@/domain/shared/events/build-event";
import { buildRedisLockService } from "@/infrastructure/redis/redis-lock-service.adapter";
import { buildRedisEventPublisher } from "@/infrastructure/redis/redis-event-publisher.adapter";
import { redisClient } from "@/infrastructure/redis/redis-client";
import { LockKeys } from "@/application/shared/lock-service/lock-service.registry";
import { LockKey } from "@/application/shared/lock-service/lock-service.types";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";

/** Input schema for begin edit. */
const inputSchema = z.object({
  itemId: z.string().min(1),
  ttlMs: z
    .number()
    .min(1000)
    .max(10 * 60 * 1000)
    .default(60_000),
});

export type BeginEditItemDeps = {
  lockService: LockServicePort;
  events: IEventPublisherPort;
};

// TODO: about locks:
// My release currently does:
//
//   GET
// compare lockedBy
// DEL
// This can technically race (rare but possible). The safer Redis pattern uses a Lua script to atomically check and delete.
//
// But for most internal systems your approach is acceptable.

/**
 * Use case: try to lock an item for editing.
 * Emits: item.locked or item.lock.denied
 */
export const buildBeginEditItemUsecase = (deps: BeginEditItemDeps) =>
  authenticatedUsecaseFactory({
    key: "item.begin-edit",
    auth: "required",
    requiredPermissions: ["items:update"],
    inputSchema,
    execute: async ({
      input,
      authContext: { storeId, adminId },
    }: {
      input: z.infer<typeof inputSchema>;
      authContext: AuthContext;
    }) => {
      const key: LockKey = LockKeys.item(storeId, input.itemId);
      const res: LockResult = await deps.lockService.acquire(
        key,
        adminId,
        input.ttlMs,
      );

      if (res.ok) {
        await deps.events.publish(
          buildEvent(
            "item.locked",
            {
              storeId,
              itemId: input.itemId,
              lockedBy: adminId,
              expiresAt: res.expiresAt,
            },
            adminId,
          ),
        );

        return {
          locked: true,
          lockedBy: adminId,
          expiresAt: res.expiresAt,
          token: res.token,
        };
      }

      await deps.events.publish(
        buildEvent(
          "item.lock.denied",
          {
            storeId: storeId,
            requestedBy: adminId,
            itemId: input.itemId,
            lockedBy: res.lockedBy,
            expiresAt: res.expiresAt,
          },
          adminId,
        ),
      );

      return {
        locked: false,
        lockedBy: res.lockedBy,
        expiresAt: res.expiresAt,
      };
    },
  });

export const beginEditItemUsecase = buildBeginEditItemUsecase({
  lockService: buildRedisLockService(redisClient),
  events: buildRedisEventPublisher(redisClient),
});
