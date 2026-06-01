import { LockServicePort } from "@/src/application/shared/lock-service/lock-service.port";
import {
  LockResultFailure,
  LockResultOk,
} from "@/src/application/shared/lock-service/lock-service.types";
import { LockKeys } from "@/src/application/shared/lock-service/lock-service.registry";
import { LockKey } from "@/src/application/shared/lock-service/lock-service.types";
import { IEventPublisherPort } from "@/src/application/shared/ports/event-publisher.port";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { Permission } from "@/features/auth/domain/types/permission.type";
import { brand } from "@/lib/brand";

export const ITEMS_UPDATE_PERMISSION = "items:update" as Permission;

/** Auth context with permission required by item lock use cases. */
export const LOCK_AUTH_CONTEXT: AuthContext = {
  adminId: brand("admin-1"),
  storeId: brand("store-1"),
  storeSlug: "store-1",
  username: "lock-tester",
  roleId: "role-1",
  grantsAll: false,
  sub: "admin-1",
  exp: 9_999_999_999,
  iat: 0,
  permissions: [ITEMS_UPDATE_PERMISSION],
};

export function createMockLockService(): jest.Mocked<LockServicePort> {
  return {
    acquire: jest.fn(),
    release: jest.fn(),
    refresh: jest.fn(),
    get: jest.fn(),
  };
}

export function createMockEventPublisher(): jest.Mocked<IEventPublisherPort> {
  return {
    publish: jest.fn().mockResolvedValue(undefined),
  };
}

export function buildItemLockKey(storeId: string, itemId: string): LockKey {
  return LockKeys.item(storeId, itemId);
}

export function lockResultOk(
  overrides: Partial<LockResultOk> = {},
): LockResultOk {
  return {
    ok: true,
    lockedBy: "admin-1",
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    lockToken: brand<string, "LockToken">("lock-token-abc"),
    ...overrides,
  };
}

export function lockResultDenied(
  overrides: Partial<LockResultFailure> = {},
): LockResultFailure {
  return {
    ok: false,
    lockedBy: "other-admin",
    expiresAt: new Date(Date.now() + 30_000).toISOString(),
    ...overrides,
  };
}

export const LOCK_TOKEN = brand<string, "LockToken">("lock-token-abc");

export const ACQUIRE_LOCK_INPUT = {
  entityId: "item-1",
  ttlMs: 5_000,
} as const;

export const RELEASE_LOCK_INPUT = {
  entityId: "item-1",
  lockToken: "lock-token-abc",
} as const;

export const REFRESH_LOCK_INPUT = {
  entityId: "item-1",
  token: "lock-token-abc",
  ttlMs: 5_000,
} as const;
