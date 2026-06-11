import { brand } from "@/lib/brand";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import { LockServicePort } from "@/src/application/shared/lock-service/lock-service.port";
import { LockKey, LockToken } from "@/src/application/shared/lock-service/lock-service.types";
import type { RefreshLockInput } from "@/src/application/shared/lock-service/schema/refresh-lock.schema";
import { StoreId } from "@/src/domain/store/store-id";

export type RefreshLockUsecaseDeps = {
  lockService: LockServicePort;
  buildLockKey: (storeId: StoreId, entityId: string) => LockKey;
};

export type RefreshLockOutput = { ok: boolean };

export const refreshLockUsecase = defineUsecase<
  RefreshLockInput,
  RefreshLockOutput,
  StoreAuthContext,
  RefreshLockUsecaseDeps
>(async (input, context, deps) => {
  const key = deps.buildLockKey(
    brand<string, StoreId>(context.storeId) as StoreId,
    input.entityId,
  );

  const ok = await deps.lockService.refresh(
    key,
    brand<string, LockToken>(input.token) as LockToken,
    input.ttlMs,
  );

  return { ok };
});
