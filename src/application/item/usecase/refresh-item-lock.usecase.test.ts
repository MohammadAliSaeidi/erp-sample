import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildRefreshLockRequest } from "@/src/application/shared/lock-service/composition/lock-requests";
import { itemLockDeps } from "@/src/application/item/composition/item-lock-deps";
import {
  buildItemLockKey,
  createMockLockService,
  LOCK_BASE_CONTEXT,
  REFRESH_LOCK_INPUT,
} from "@/src/application/shared/lock-service/testing/lock-usecase-test.helpers";
import { brand } from "@/lib/brand";
import { LockToken } from "@/src/application/shared/lock-service/lock-service.types";

describe("refresh item lock", () => {
  const runner = buildUsecaseRunner();
  const lockService = createMockLockService();
  const deps = {
    ...itemLockDeps.refresh,
    lockService,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("refreshes tenant-scoped item lock with ownership token", async () => {
    lockService.refresh.mockResolvedValue(true);

    const result = await runner.runWithInput(
      buildRefreshLockRequest(
        REFRESH_LOCK_INPUT,
        LOCK_BASE_CONTEXT,
        deps,
        [PERMISSIONS.ITEMS.UPDATE],
      ),
    );

    expect(result).toEqual({ ok: true });
    expect(lockService.refresh).toHaveBeenCalledWith(
      buildItemLockKey("store-1", "item-1"),
      brand<string, LockToken>(REFRESH_LOCK_INPUT.token),
      REFRESH_LOCK_INPUT.ttlMs,
    );
  });

  it("returns ok: false when refresh is denied", async () => {
    lockService.refresh.mockResolvedValue(false);

    const result = await runner.runWithInput(
      buildRefreshLockRequest(
        REFRESH_LOCK_INPUT,
        LOCK_BASE_CONTEXT,
        deps,
        [PERMISSIONS.ITEMS.UPDATE],
      ),
    );

    expect(result).toEqual({ ok: false });
  });
});
