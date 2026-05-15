import { runUsecase } from "@/features/shared/application/run-use-case";
import { UseCaseValidationError } from "@/application/errors/use-case-errors";
import { buildRefreshLockUsecase } from "./refresh-lock.usecase";
import {
  buildItemLockKey,
  createMockLockService,
  ITEMS_UPDATE_PERMISSION,
  LOCK_AUTH_CONTEXT,
  REFRESH_LOCK_INPUT,
} from "../testing/lock-usecase-test.helpers";

describe("buildRefreshLockUsecase", () => {
  const lockService = createMockLockService();

  const useCase = buildRefreshLockUsecase({
    key: "test.refresh-lock",
    permissions: [ITEMS_UPDATE_PERMISSION],
    lockService,
    buildLockKey: buildItemLockKey,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("refreshes using tenant-scoped key and ownership token", async () => {
    lockService.refresh.mockResolvedValue(true);

    const result = await runUsecase({
      useCase,
      input: REFRESH_LOCK_INPUT,
      authContext: LOCK_AUTH_CONTEXT,
    });

    expect(result).toEqual({ ok: true });
    expect(lockService.refresh).toHaveBeenCalledWith(
      buildItemLockKey("store-1", "item-1"),
      REFRESH_LOCK_INPUT.token,
      REFRESH_LOCK_INPUT.ttlMs,
    );
  });

  it("returns ok: false when token does not match lock owner", async () => {
    lockService.refresh.mockResolvedValue(false);

    const result = await runUsecase({
      useCase,
      input: REFRESH_LOCK_INPUT,
      authContext: LOCK_AUTH_CONTEXT,
    });

    expect(result).toEqual({ ok: false });
  });

  it.each([
    ["ttl below minimum", { entityId: "item-1", token: "t", ttlMs: 500 }],
    ["ttl above maximum", { entityId: "item-1", token: "t", ttlMs: 11 * 60 * 1000 }],
    ["empty entity id", { entityId: "", token: "t", ttlMs: 5_000 }],
  ])("rejects invalid input: %s", async (_label, input) => {
    await expect(
      runUsecase({
        useCase,
        input,
        authContext: LOCK_AUTH_CONTEXT,
      }),
    ).rejects.toBeInstanceOf(UseCaseValidationError);

    expect(lockService.refresh).not.toHaveBeenCalled();
  });
});
