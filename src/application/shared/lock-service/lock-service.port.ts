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
   * Release a lock if held by the same actor.
   * @param key Entity lock key.
   * @param lockToken token of who is releasing.
   */
  release(
    key: LockKey,
    actorAdminId: StoreAdminId,
    lockToken: LockToken,
  ): Promise<UnlockResult>;

  /**
   * Refresh/extend a lock TTL if the caller still owns it.
   * Ownership is verified by token to prevent stale or cross-session refresh.
   *
   * @param key The lock key for the entity (e.g. store:item).
   * @param token The lock token issued at acquisition time.
   * @param ttlMs New TTL in milliseconds.
   * @returns true if refreshed, false if token mismatch or lock missing.
   */
  refresh(
    key: LockKey,
    actorAdminId: StoreAdminId,
    token: string,
    ttlMs: number,
  ): Promise<boolean>;

  /**
   * Check current lock state.
   * @param key Entity lock key.
   */
  get(key: LockKey): Promise<LockResult | null>;
}
