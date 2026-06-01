import type { Redis } from "ioredis";
import { brand } from "@/lib/brand";
import { LockKeys } from "@/src/application/shared/lock-service/lock-service.registry";
import type { LockKey } from "@/src/application/shared/lock-service/lock-service.types";
import { StoreAdminId } from "@/src/domain/store-admin/store-admin-id";
import { buildRedisLockService } from "./redis-lock-service.adapter";

/**
 * Minimal in-memory Redis for adapter tests (no external Redis required).
 * Implements SET NX PX, GET, and EVAL used by the lock adapter.
 */
function createMemoryRedis(): Redis {
  const store = new Map<string, string>();

  return {
    async set(
      key: string,
      value: string,
      expiryMode?: string,
      ttlMs?: number,
      setMode?: string,
    ) {
      if (expiryMode === "PX" && setMode === "NX") {
        if (store.has(key)) return null;
        store.set(key, value);
        return "OK";
      }
      store.set(key, value);
      return "OK";
    },

    async get(key: string) {
      return store.get(key) ?? null;
    },

    async eval(script: string, _numKeys: number, key: string, ...args: string[]) {
      const raw = store.get(key);
      if (!raw) return 0;

      let data: Record<string, unknown>;
      try {
        data = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        return 0;
      }

      const token = args[0];

      if (script.includes('redis.call("DEL"')) {
        if (data.lockToken === token) {
          store.delete(key);
          return 1;
        }
        return 0;
      }

      if (script.includes('redis.call("SET"')) {
        if (data.lockToken !== token) return 0;
        data.expiresAt = args[2];
        store.set(key, JSON.stringify(data));
        return 1;
      }

      return 0;
    },
  } as unknown as Redis;
}

describe("RedisLockService", () => {
  const storeId = brand<string, "StoreId">(
    "0194a1b2-c3d7-7000-8000-000000000001",
  );
  const itemId = brand<string, "ItemId">(
    "0194a1b2-c3d7-7000-8000-000000000002",
  );
  const adminId = brand<string, "StoreAdminId">(
    "0194a1b2-c3d7-7000-8000-000000000003",
  ) as StoreAdminId;

  const key: LockKey = LockKeys.item(storeId, itemId);
  const ttlMs = 5_000;

  describe("happy path", () => {
    it("acquire on empty key returns ok with lockToken", async () => {
      const service = buildRedisLockService(createMemoryRedis());

      const result = await service.acquire(key, adminId, ttlMs);

      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.lockToken).toBeDefined();
      expect(result.lockedBy).toBe(String(adminId));
      expect(result.expiresAt).toBeDefined();
    });

    it("release with lockToken from acquire returns { ok: true } and removes the key", async () => {
      const redis = createMemoryRedis();
      const service = buildRedisLockService(redis);

      const acquired = await service.acquire(key, adminId, ttlMs);
      expect(acquired.ok).toBe(true);
      if (!acquired.ok) return;

      const released = await service.release(key, acquired.lockToken);

      expect(released).toEqual({ ok: true });
      expect(await service.get(key)).toBeNull();
    });
  });

  describe("edge cases (planned — implement in Phase 1.2+)", () => {
    it.todo("denies acquire when lock already exists");
    it.todo("release with wrong token returns { ok: false } and keeps the lock");
    it.todo("refresh with correct token extends TTL");
    it.todo("refresh with wrong token returns false");
  });
});
