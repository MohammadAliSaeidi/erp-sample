import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildReleaseLockRequest } from "@/src/application/shared/lock-service/composition/lock-requests";
import { itemLockDeps } from "@/src/application/item/composition/item-lock-deps";
import {
  buildItemLockKey,
  createMockLockService,
  createMockEventPublisher,
  LOCK_BASE_CONTEXT,
  LOCK_TOKEN,
  RELEASE_LOCK_INPUT,
} from "@/src/application/shared/lock-service/testing/lock-usecase-test.helpers";

describe("release edit item lock", () => {
  const runner = buildUsecaseRunner();
  const lockService = createMockLockService();
  const eventPublisher = createMockEventPublisher();
  const deps = {
    ...itemLockDeps.release,
    lockService,
    eventPublisher,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("releases with lock token against tenant-scoped item key", async () => {
    lockService.release.mockResolvedValue({ ok: true });

    const result = await runner.runWithInput(
      buildReleaseLockRequest(
        RELEASE_LOCK_INPUT,
        LOCK_BASE_CONTEXT,
        deps,
        [PERMISSIONS.ITEMS.UPDATE],
      ),
    );

    expect(result).toEqual({ ok: true });
    expect(lockService.release).toHaveBeenCalledWith(
      buildItemLockKey("store-1", "item-1"),
      LOCK_TOKEN,
    );
  });

  it("publishes item.unlocked when release succeeds", async () => {
    lockService.release.mockResolvedValue({ ok: true });

    await runner.runWithInput(
      buildReleaseLockRequest(
        RELEASE_LOCK_INPUT,
        LOCK_BASE_CONTEXT,
        deps,
        [PERMISSIONS.ITEMS.UPDATE],
      ),
    );

    expect(eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "item.unlocked",
        payload: expect.objectContaining({
          storeId: "store-1",
          itemId: "item-1",
          unlockedBy: "admin-1",
        }),
      }),
    );
  });

  it("publishes item.unlock.denied when token is stale or wrong", async () => {
    lockService.release.mockResolvedValue({ ok: false });

    const result = await runner.runWithInput(
      buildReleaseLockRequest(
        RELEASE_LOCK_INPUT,
        LOCK_BASE_CONTEXT,
        deps,
        [PERMISSIONS.ITEMS.UPDATE],
      ),
    );

    expect(result).toEqual({ ok: false });
    expect(eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "item.unlock.denied",
        payload: expect.objectContaining({
          storeId: "store-1",
          itemId: "item-1",
        }),
      }),
    );
  });
});
