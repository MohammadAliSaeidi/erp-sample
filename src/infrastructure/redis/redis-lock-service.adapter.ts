import type { LockServicePort } from "@/src/application/shared/lock-service/lock-service.port";
import {
  type LockKey,
  type LockResult,
  type LockResultFailure,
  type LockResultOk,
  type LockToken,
  type UnlockResult,
} from "@/src/application/shared/lock-service/lock-service.types";
import { StoreAdminId } from "@/src/domain/store-admin/store-admin-id";
import { StoreId } from "@/src/domain/store/store-id";
import { Brand, brand } from "@/lib/brand";
import type { Redis } from "ioredis";
import { randomUUID } from "node:crypto";

export type ISO = Brand<string, "ISO">;

type StoredLockValue<TBrand extends string> = {
  storeId: StoreId;
  entityId: Brand<string, TBrand>;
  lockedBy: StoreAdminId;
  lockToken: LockToken;
  expiresAt: ISO;
};

function parseStoredLock<TEntityBrand extends string>(
  raw: string | null,
): StoredLockValue<TEntityBrand> | null {
  if (!raw) return null;

  try {
    const v = JSON.parse(raw) as StoredLockValue<TEntityBrand>;

    if (
      typeof v.storeId !== "string" ||
      typeof v.entityId !== "string" ||
      typeof v.lockedBy !== "string" ||
      typeof v.lockToken !== "string" ||
      typeof v.expiresAt !== "string"
    ) {
      return null;
    }
    return {
      storeId: v.storeId,
      entityId: v.entityId,
      lockedBy: v.lockedBy,
      lockToken: v.lockToken,
      expiresAt: v.expiresAt,
    };
  } catch {
    return null;
  }
}

function lockOk<TEntityBrand extends string>(
  v: StoredLockValue<TEntityBrand>,
): LockResultOk {
  return {
    ok: true,
    lockedBy: v.lockedBy,
    expiresAt: v.expiresAt,
    lockToken: v.lockToken,
  };
}

function lockDenied<TEntityBrand extends string>(
  v: StoredLockValue<TEntityBrand>,
): LockResultFailure {
  return {
    ok: false,
    lockedBy: v.lockedBy,
    expiresAt: v.expiresAt,
  };
}

// Atomic compare-token-and-delete
const RELEASE_LUA = `
local key = KEYS[1]
local token = ARGV[1]
local raw = redis.call("GET", key)
if not raw then
  return 0
end
local data = cjson.decode(raw)
if data["lockToken"] == token then
  return redis.call("DEL", key)
end
return 0
`;

// Atomic compare-token-and-refresh (+update expiresAt in value)
const REFRESH_LUA = `
local key = KEYS[1]
local token = ARGV[1]
local ttlMs = tonumber(ARGV[2])
local expiresAtIso = ARGV[3]

local raw = redis.call("GET", key)
if not raw then
  return 0
end

local data = cjson.decode(raw)
if data["lockToken"] ~= token then
  return 0
end

data["expiresAt"] = expiresAtIso
redis.call("SET", key, cjson.encode(data), "PX", ttlMs, "XX")
return 1
`;

export function buildRedisLockService(client: Redis): LockServicePort {
  return {
    async acquire<TEntityBrand extends string>(
      key: LockKey,
      storeAdminId: StoreAdminId,
      ttlMs: number,
    ): Promise<LockResult> {
      // Derive store/entity from key if you encode them there.
      // For simplicity, keep raw key as entityId fallback:
      const now = Date.now();
      const expiresAt = new Date(now + ttlMs).toISOString();
      const token = randomUUID();

      // Optional parse from key pattern store:{storeId}:item:{entityId}
      const m = String(key).match(/^store:(.+):item:(.+)$/);
      const storeId = m?.[1] ?? "unknown-store";
      const entityId = m?.[2] ?? String(key);

      const value: StoredLockValue<TEntityBrand> = {
        storeId: brand(storeId),
        entityId: brand(entityId),
        lockedBy: storeAdminId,
        lockToken: brand(token),
        expiresAt: brand(expiresAt),
      };

      const setResult = await client.set(
        String(key),
        JSON.stringify(value),
        "PX",
        ttlMs,
        "NX",
      );

      if (setResult === "OK") return lockOk(value);

      const existing = parseStoredLock(await client.get(String(key)));
      if (existing) return lockDenied(existing);

      return {
        ok: false,
        lockedBy: storeAdminId,
        expiresAt,
      };
    },

    async release(
      key: LockKey,
      lockToken: LockToken,
    ): Promise<UnlockResult> {
      const result = await client.eval(
        RELEASE_LUA,
        1,
        String(key),
        String(lockToken),
      );

      return { ok: Number(result) > 0 };
    },

    async refresh(
      key: LockKey,
      lockToken: LockToken,
      ttlMs: number,
    ): Promise<boolean> {
      const expiresAtIso = new Date(Date.now() + ttlMs).toISOString();
      const result = await client.eval(
        REFRESH_LUA,
        1,
        String(key),
        String(lockToken),
        String(ttlMs),
        expiresAtIso,
      );
      return Number(result) === 1;
    },

    async get(key: LockKey): Promise<LockResult | null> {
      const existing = parseStoredLock(await client.get(String(key)));
      if (!existing) return null;
      return lockOk(existing);
    },
  };
}
