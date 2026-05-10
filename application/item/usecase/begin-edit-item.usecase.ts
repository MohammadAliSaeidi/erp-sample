import { EventPublisherPort } from "@/application/shared/ports/event-publisher.port";
import { LockServicePort } from "@/application/shared/ports/lock-service.port";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { z } from "zod";

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
  events: EventPublisherPort;
};

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
    execute: async ({ input, authContext: { storeId, adminId } }) => {
      const key = `store:${storeId}:item:${input.itemId}`;

      const res = await deps.lockService.acquire(key, adminId, input.ttlMs);

      if (res.ok) {
        await deps.events.publish({
          type: "item.locked",
          payload: {
            storeId: storeId,
            itemId: input.itemId,
            lockedBy: adminId,
            expiresAt: res.expiresAt,
          },
          meta: { actorId: adminId, occurredAt: new Date().toISOString() },
        });

        return { locked: true, lockedBy: adminId, expiresAt: res.expiresAt };
      }

      await deps.events.publish({
        type: "item.lock.denied",
        payload: {
          storeId: storeId,
          itemId: input.itemId,
          lockedBy: res.lockedBy,
          expiresAt: res.expiresAt,
        },
        meta: { actorId: adminId, occurredAt: new Date().toISOString() },
      });

      return {
        locked: false,
        lockedBy: res.lockedBy,
        expiresAt: res.expiresAt,
      };
    },
  });
