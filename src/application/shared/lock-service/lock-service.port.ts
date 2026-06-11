import {
  LockKey,
  LockResult,
  LockToken,
  UnlockResult,
} from "@/src/application/shared/lock-service/lock-service.types";
import { StoreAdminId } from "@/src/domain/store-admin/store-admin-id";

export interface LockServicePort {
  /**
   * Try to acquire a lock.
   * @param key Entity lock key (e.g. "item:123").
   * @param storeAdminId Who is locking.
   * @param ttlMs Lock TTL in milliseconds.
   */
  acquire(
    key: LockKey,
    storeAdminId: StoreAdminId,
    ttlMs: number,
  ): Promise<LockResult>;

  /**
   * Release a lock when the caller presents the correct lock token.
   */
  release(key: LockKey, lockToken: LockToken): Promise<UnlockResult>;

  /**
   * Refresh/extend a lock TTL if the token still matches.
   */
  refresh(key: LockKey, token: LockToken, ttlMs: number): Promise<boolean>;

  /**
   * Check current lock state.
   * @param key Entity lock key.
   */
  get(key: LockKey): Promise<LockResult | null>;
}
