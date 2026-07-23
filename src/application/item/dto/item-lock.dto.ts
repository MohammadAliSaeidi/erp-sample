import type { LockResult } from "@/src/application/shared/lock-service/lock-service.types";

export type AcquireItemLockInputDTO = {
  entityId: string;
  ttlMs?: number;
};

export type ReleaseItemLockInputDTO = {
  entityId: string;
  lockToken: string;
};

export type RefreshItemLockInputDTO = {
  entityId: string;
  lockToken: string;
  ttlMs?: number;
};

export type ItemLockAcquireResultDTO = LockResult;

export type ItemLockReleaseResultDTO = {
  ok: boolean;
};

export type ItemLockRefreshResultDTO = {
  ok: boolean;
};

export const DEFAULT_ITEM_LOCK_TTL_MS = 60_000;
