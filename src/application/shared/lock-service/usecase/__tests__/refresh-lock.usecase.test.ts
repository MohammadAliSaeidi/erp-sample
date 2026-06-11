import { InputValidationError } from "@/src/application/core/errors/input-validation.error";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildRefreshLockRequest } from "@/src/application/shared/lock-service/composition/lock-requests";
import { refreshLockUsecase } from "../refresh-lock.usecase";
import {
  buildItemLockKey,
  createMockLockService,
  ITEMS_UPDATE_PERMISSION,
  LOCK_BASE_CONTEXT,
  LOCK_STORE_AUTH_CONTEXT,
  REFRESH_LOCK_INPUT,
} from "../../testing/lock-usecase-test.helpers";
import { brand } from "@/lib/brand";
import { LockToken } from "@/src/application/shared/lock-service/lock-service.types";

describe("refreshLockUsecase", () => {
  const lockService = createMockLockService();
  const runner = buildUsecaseRunner();
  const deps = {
    lockService,
    buildLockKey: buildItemLockKey,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("refreshes using tenant-scoped key and ownership token", async () => {
    lockService.refresh.mockResolvedValue(true);

    const result = await refreshLockUsecase.execute(
      REFRESH_LOCK_INPUT,
      LOCK_STORE_AUTH_CONTEXT,
      deps,
    );

    expect(result).toEqual({ ok: true });
    expect(lockService.refresh).toHaveBeenCalledWith(
      buildItemLockKey("store-1", "item-1"),
      brand<string, LockToken>(REFRESH_LOCK_INPUT.token),
      REFRESH_LOCK_INPUT.ttlMs,
    );
  });

  it("returns ok: false when token does not match lock owner", async () => {
    lockService.refresh.mockResolvedValue(false);

    const result = await runner.runWithInput(
      buildRefreshLockRequest(
        REFRESH_LOCK_INPUT,
        LOCK_BASE_CONTEXT,
        deps,
        [ITEMS_UPDATE_PERMISSION],
      ),
    );

    expect(result).toEqual({ ok: false });
  });

  it("rejects invalid input before calling lock service", async () => {
    await expect(
      runner.runWithInput(
        buildRefreshLockRequest(
          { entityId: "", token: "t", ttlMs: 5_000 },
          LOCK_BASE_CONTEXT,
          deps,
          [ITEMS_UPDATE_PERMISSION],
        ),
      ),
    ).rejects.toBeInstanceOf(InputValidationError);

    expect(lockService.refresh).not.toHaveBeenCalled();
  });
});
