import type { Redis } from "ioredis";
import type {
  LockResult,
  LockServicePort,
} from "@/application/shared/ports/lock-service.port";

type StoredLockValue = {
  lockedBy: string;
  expiresAt: string;
};

function parseStoredLock(raw: string | null): StoredLockValue | null {
  if (!raw) return null;

  try {
    const value = JSON.parse(raw) as Partial<StoredLockValue>;
    if (
      typeof value.lockedBy !== "string" ||
      typeof value.expiresAt !== "string"
    ) {
      return null;
    }
    return { lockedBy: value.lockedBy, expiresAt: value.expiresAt };
  } catch {
    return null;
  }
}

export function buildRedisLockService(client: Redis): LockServicePort {
  return {
    async acquire(
      key: string,
      actorAdminId: string,
      ttlMs: number,
    ): Promise<LockResult> {
      const expiresAt = new Date(Date.now() + ttlMs).toISOString();
      const value = JSON.stringify({
        lockedBy: actorAdminId,
        expiresAt,
      } satisfies StoredLockValue);

      const setResult = await client.set(key, value, "PX", ttlMs, "NX");
      if (setResult === "OK") {
        return { ok: true, lockedBy: actorAdminId, expiresAt };
      }

      const existing = parseStoredLock(await client.get(key));
      if (existing) {
        return { ok: false, ...existing };
      }

      return { ok: false, lockedBy: actorAdminId, expiresAt };
    },

    async release(key: string, actorAdminId: string): Promise<boolean> {
      const raw = await client.get(key);
      const existing = parseStoredLock(raw);
      if (!existing || existing.lockedBy !== actorAdminId) {
        return false;
      }

      const deleted = await client.del(key);
      return deleted > 0;
    },

    async get(key: string): Promise<LockResult | null> {
      const existing = parseStoredLock(await client.get(key));
      if (!existing) return null;
      return { ok: true, ...existing };
    },
  };
}
