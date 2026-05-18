import { z } from "zod";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { LockServicePort } from "@/src/application/shared/lock-service/lock-service.port";
import { LockKey } from "@/src/application/shared/lock-service/lock-service.types";
import { Permission } from "@/features/auth/domain/types/permission.type";

export type RefreshLockDeps = {
  lockService: LockServicePort;
  buildLockKey: (storeId: string, entityId: string) => LockKey;
  permissions: Permission[];
  key: string;
};

const inputSchema = z.object({
  entityId: z.string().min(1),
  ttlMs: z
    .number()
    .min(1000)
    .max(10 * 60 * 1000),
  token: z.string().brand(""),
});

export const buildRefreshLockUsecase = (deps: RefreshLockDeps) =>
  authenticatedUsecaseFactory({
    key: deps.key,
    auth: "required",
    requiredPermissions: deps.permissions,
    inputSchema,
    execute: async ({ input, authContext: { storeId, adminId } }) => {
      const key = deps.buildLockKey(storeId, input.entityId);
      const ok = await deps.lockService.refresh(
        key,
        adminId,
        input.token,
        input.ttlMs,
      );
      return { ok };
    },
  });
