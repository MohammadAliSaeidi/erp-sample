import { describe, it, expect, vi } from "vitest";
import { buildAcquireLockUsecase } from "./acquire-lock.usecase";
import { LockResultFailure, LockResultOk } from "../lock-service.port";

describe("AcquireLock UseCase Logic", () => {
  const mockLockService = {
    acquire: vi.fn(),
    release: vi.fn(),
    refresh: vi.fn(),
    get: vi.fn(),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const authContext = {
    adminId: "admin-1",
    storeId: "store-1",
    permissions: ["items:update"],
  };

  const deps = {
    key: "test.lock",
    requiredPermissions: ["items:update"],
    lockService: mockLockService,
    eventPublisher: mockEventPublisher,
    buildLockKey: (s: string, e: string) => `lock:${s}:${e}` as any,
    eventFactory: {
      locked: (ctx: any, input: any, result: LockResultOk) => ({
        type: "locked",
        payload: { id: input.entityId, token: result.token },
      }),
      denied: (ctx: any, input: any, result: LockResultFailure) => ({
        type: "denied",
        payload: { id: input.entityId, owner: result.lockedBy },
      }),
    },
  };

  it("should return success and publish event when lock is available", async () => {
    const useCase = buildAcquireLockUsecase(deps as any);
    const mockResult: LockResultOk = {
      ok: true,
      lockedBy: "admin-1",
      expiresAt: "2026-05-15T10:00:00Z",
      token: "valid-token" as any,
    };

    mockLockService.acquire.mockResolvedValue(mockResult);

    const result = await useCase.execute({
      input: { entityId: "item-123", ttlMs: 5000 },
      authContext: authContext as any,
    });

    expect(result.ok).toBe(true);
    expect(mockLockService.acquire).toHaveBeenCalledWith(
      "lock:store-1:item-123",
      "admin-1",
      5000,
    );
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: "locked" }),
    );
  });

  it("should return failure and publish denied event when already locked", async () => {
    const useCase = buildAcquireLockUsecase(deps as any);
    mockLockService.acquire.mockResolvedValue({
      ok: false,
      lockedBy: "other-user",
      expiresAt: "...",
    });

    const result = await useCase.execute({
      input: { entityId: "item-123", ttlMs: 5000 },
      authContext: authContext as any,
    });

    expect(result.ok).toBe(false);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: "denied" }),
    );
  });
});
