import { buildEvent } from "@/src/domain/shared/events/build-event";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { UseCaseValidationError } from "@/src/application/shared/errors/use-case-errors";
import { buildAcquireLockUsecase } from "../acquire-lock.usecase";
import {
  ACQUIRE_LOCK_INPUT,
  buildItemLockKey,
  createMockEventPublisher,
  createMockLockService,
  ITEMS_UPDATE_PERMISSION,
  LOCK_AUTH_CONTEXT,
  lockResultDenied,
  lockResultOk,
} from "../../testing/lock-usecase-test.helpers";

describe("buildAcquireLockUsecase", () => {
  const lockService = createMockLockService();
  const eventPublisher = createMockEventPublisher();

  const useCase = buildAcquireLockUsecase({
    key: "test.acquire-lock",
    requiredPermissions: [ITEMS_UPDATE_PERMISSION],
    lockService,
    eventPublisher,
    buildLockKey: buildItemLockKey,
    eventFactory: {
      buildLockedEvent: (ctx, input, result) =>
        buildEvent(
          "item.locked",
          {
            storeId: String(ctx.storeId),
            itemId: input.entityId,
            lockedBy: String(ctx.adminId),
            expiresAt: result.expiresAt,
            token: result.lockToken,
          },
          undefined,
        ),
      buildDeniedEvent: (ctx, input, result) =>
        buildEvent(
          "item.lock.denied",
          {
            storeId: String(ctx.storeId),
            itemId: input.entityId,
            requestedBy: String(ctx.adminId),
            lockedBy: result.lockedBy,
            expiresAt: result.expiresAt,
          },
          undefined,
        ),
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("lock orchestration", () => {
    it("acquires using tenant-scoped key and actor admin id", async () => {
      const acquired = lockResultOk();
      lockService.acquire.mockResolvedValue(acquired);

      const result = await runUsecase({
        useCase,
        input: ACQUIRE_LOCK_INPUT,
        authContext: LOCK_AUTH_CONTEXT,
      });

      expect(result).toEqual(acquired);
      expect(lockService.acquire).toHaveBeenCalledWith(
        buildItemLockKey("store-1", "item-1"),
        LOCK_AUTH_CONTEXT.adminId,
        ACQUIRE_LOCK_INPUT.ttlMs,
      );
    });

    it("returns denial without throwing when lock is held by another actor", async () => {
      const denied = lockResultDenied();
      lockService.acquire.mockResolvedValue(denied);

      const result = await runUsecase({
        useCase,
        input: ACQUIRE_LOCK_INPUT,
        authContext: LOCK_AUTH_CONTEXT,
      });

      expect(result).toEqual(denied);
    });
  });

  describe("domain events", () => {
    it("publishes item.locked when acquisition succeeds", async () => {
      const acquired = lockResultOk();
      lockService.acquire.mockResolvedValue(acquired);

      await runUsecase({
        useCase,
        input: ACQUIRE_LOCK_INPUT,
        authContext: LOCK_AUTH_CONTEXT,
      });

      expect(eventPublisher.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "item.locked",
          payload: expect.objectContaining({
            storeId: "store-1",
            itemId: "item-1",
            token: acquired.lockToken,
          }),
        }),
      );
    });

    it("publishes item.lock.denied when acquisition fails", async () => {
      lockService.acquire.mockResolvedValue(lockResultDenied());

      await runUsecase({
        useCase,
        input: ACQUIRE_LOCK_INPUT,
        authContext: LOCK_AUTH_CONTEXT,
      });

      expect(eventPublisher.publish).toHaveBeenCalledWith(
        expect.objectContaining({ type: "item.lock.denied" }),
      );
    });

    it("skips publishing when emitEvents is false", async () => {
      const silentUseCase = buildAcquireLockUsecase({
        key: "test.acquire-lock.silent",
        requiredPermissions: [ITEMS_UPDATE_PERMISSION],
        lockService,
        eventPublisher,
        emitEvents: false,
        buildLockKey: buildItemLockKey,
        eventFactory: {
          buildLockedEvent: (ctx, input, result) =>
            buildEvent(
              "item.locked",
              {
                storeId: String(ctx.storeId),
                itemId: input.entityId,
                lockedBy: String(ctx.adminId),
                expiresAt: result.expiresAt,
                token: result.lockToken,
              },
              undefined,
            ),
          buildDeniedEvent: (ctx, input, result) =>
            buildEvent(
              "item.lock.denied",
              {
                storeId: String(ctx.storeId),
                itemId: input.entityId,
                requestedBy: String(ctx.adminId),
                lockedBy: result.lockedBy,
                expiresAt: result.expiresAt,
              },
              undefined,
            ),
        },
      });

      lockService.acquire.mockResolvedValue(lockResultOk());

      await runUsecase({
        useCase: silentUseCase,
        input: ACQUIRE_LOCK_INPUT,
        authContext: LOCK_AUTH_CONTEXT,
      });

      expect(eventPublisher.publish).not.toHaveBeenCalled();
    });
  });

  describe("input validation", () => {
    it.each([
      ["ttl below minimum", { entityId: "item-1", ttlMs: 500 }],
      ["ttl above maximum", { entityId: "item-1", ttlMs: 11 * 60 * 1000 }],
      ["empty entity id", { entityId: "", ttlMs: 5_000 }],
    ])("rejects invalid input: %s", async (_label, input) => {
      await expect(
        runUsecase({
          useCase,
          input,
          authContext: LOCK_AUTH_CONTEXT,
        }),
      ).rejects.toBeInstanceOf(UseCaseValidationError);

      expect(lockService.acquire).not.toHaveBeenCalled();
    });
  });
});
