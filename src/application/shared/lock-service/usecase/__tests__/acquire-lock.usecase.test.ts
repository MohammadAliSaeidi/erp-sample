import { buildEvent } from "@/src/domain/shared/events/build-event";
import { InputValidationError } from "@/src/application/core/errors/input-validation.error";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildAcquireLockRequest } from "@/src/application/shared/lock-service/composition/lock-requests";
import { acquireLockUsecase } from "../acquire-lock.usecase";
import {
  ACQUIRE_LOCK_INPUT,
  buildItemLockKey,
  createMockEventPublisher,
  createMockLockService,
  ITEMS_UPDATE_PERMISSION,
  LOCK_BASE_CONTEXT,
  LOCK_STORE_AUTH_CONTEXT,
  lockResultDenied,
  lockResultOk,
} from "../../testing/lock-usecase-test.helpers";

describe("acquireLockUsecase", () => {
  const lockService = createMockLockService();
  const eventPublisher = createMockEventPublisher();
  const runner = buildUsecaseRunner();

  const deps = {
    lockService,
    eventPublisher,
    buildLockKey: buildItemLockKey,
    eventFactory: {
      buildLockedEvent: (
        context: typeof LOCK_STORE_AUTH_CONTEXT,
        input: typeof ACQUIRE_LOCK_INPUT,
        result: ReturnType<typeof lockResultOk>,
      ) =>
        buildEvent(
          "item.locked",
          {
            storeId: context.storeId,
            itemId: input.entityId,
            lockedBy: context.adminId,
            expiresAt: result.expiresAt,
            token: result.lockToken,
          },
          undefined,
        ),
      buildDeniedEvent: (
        context: typeof LOCK_STORE_AUTH_CONTEXT,
        input: typeof ACQUIRE_LOCK_INPUT,
        result: ReturnType<typeof lockResultDenied>,
      ) =>
        buildEvent(
          "item.lock.denied",
          {
            storeId: context.storeId,
            itemId: input.entityId,
            requestedBy: context.adminId,
            lockedBy: result.lockedBy,
            expiresAt: result.expiresAt,
          },
          undefined,
        ),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("acquires using tenant-scoped key and actor admin id", async () => {
    const acquired = lockResultOk();
    lockService.acquire.mockResolvedValue(acquired);

    const result = await acquireLockUsecase.execute(
      ACQUIRE_LOCK_INPUT,
      LOCK_STORE_AUTH_CONTEXT,
      deps,
    );

    expect(result).toEqual(acquired);
    expect(lockService.acquire).toHaveBeenCalledWith(
      buildItemLockKey("store-1", "item-1"),
      LOCK_STORE_AUTH_CONTEXT.adminId,
      ACQUIRE_LOCK_INPUT.ttlMs,
    );
  });

  it("publishes item.locked when acquisition succeeds via runner", async () => {
    const acquired = lockResultOk();
    lockService.acquire.mockResolvedValue(acquired);

    await runner.runWithInput(
      buildAcquireLockRequest(
        ACQUIRE_LOCK_INPUT,
        LOCK_BASE_CONTEXT,
        deps,
        [ITEMS_UPDATE_PERMISSION],
      ),
    );

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

    await runner.runWithInput(
      buildAcquireLockRequest(
        ACQUIRE_LOCK_INPUT,
        LOCK_BASE_CONTEXT,
        deps,
        [ITEMS_UPDATE_PERMISSION],
      ),
    );

    expect(eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: "item.lock.denied" }),
    );
  });

  it("skips publishing when emitEvents is false", async () => {
    lockService.acquire.mockResolvedValue(lockResultOk());

    await runner.runWithInput(
      buildAcquireLockRequest(
        ACQUIRE_LOCK_INPUT,
        LOCK_BASE_CONTEXT,
        { ...deps, emitEvents: false },
        [ITEMS_UPDATE_PERMISSION],
      ),
    );

    expect(eventPublisher.publish).not.toHaveBeenCalled();
  });

  it("rejects invalid input before calling lock service", async () => {
    await expect(
      runner.runWithInput(
        buildAcquireLockRequest(
          { entityId: "", ttlMs: 5_000 },
          LOCK_BASE_CONTEXT,
          deps,
          [ITEMS_UPDATE_PERMISSION],
        ),
      ),
    ).rejects.toBeInstanceOf(InputValidationError);

    expect(lockService.acquire).not.toHaveBeenCalled();
  });
});
