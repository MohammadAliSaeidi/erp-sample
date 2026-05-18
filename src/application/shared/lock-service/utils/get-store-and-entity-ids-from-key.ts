import { LockKey, lockKeyRegex } from "../lock-service.types";

export function getStoreAndEntityIdsFromKey(key: LockKey) {
  const m = String(key).match(lockKeyRegex);
  const storeId = m?.[1] ?? "unknown-store";
  const entityId = m?.[2] ?? String(key);

  return { storeId, entityId };
}