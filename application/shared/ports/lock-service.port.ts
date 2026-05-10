/** Lock acquisition result. */
export type LockResult =
  | { ok: true; lockedBy: string; expiresAt: string }
  | { ok: false; lockedBy: string; expiresAt: string };

/** Port: distributed/centralized lock service for edit sessions. */
export interface LockServicePort {
  /**
   * Try to acquire a lock.
   * @param key Entity lock key (e.g. "item:123").
   * @param actorAdminId Who is locking.
   * @param ttlMs Lock TTL in milliseconds.
   */
  acquire(
    key: string,
    actorAdminId: string,
    ttlMs: number,
  ): Promise<LockResult>;

  /**
   * Release a lock if held by the same actor.
   * @param key Entity lock key.
   * @param actorAdminId Who is releasing.
   */
  release(key: string, actorAdminId: string): Promise<boolean>;

  /**
   * Check current lock state.
   * @param key Entity lock key.
   */
  get(key: string): Promise<LockResult | null>;
}
