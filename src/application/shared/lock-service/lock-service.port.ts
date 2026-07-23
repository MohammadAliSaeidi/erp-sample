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
   * Release a lock when the caller presents the token from acquire.
   * @param key Entity lock key.
   * @param lockToken Token issued at acquisition.
   */
  release(key: LockKey, lockToken: LockToken): Promise<UnlockResult>;

  /**
   * Extend lock TTL when the caller still owns it (verified by token).
   *
   * @param key Entity lock key.
   * @param lockToken Token issued at acquisition.
   * @param ttlMs New TTL in milliseconds.
   * @returns true if refreshed, false if token mismatch or lock missing.
   */
  refresh(key: LockKey, lockToken: LockToken, ttlMs: number): Promise<boolean>;

  /**
   * Check current lock state.
   * @param key Entity lock key.
   */
  get(key: LockKey): Promise<LockResult | null>;
}
