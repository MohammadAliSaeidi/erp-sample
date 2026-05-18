import { buildRefreshItemLockUsecase } from "@/src/application/item/usecase/refresh-item-lock.usecase";
import {
  buildItemLockKey,
  createMockLockService,
  LOCK_AUTH_CONTEXT,
  REFRESH_LOCK_INPUT,
} from "@/src/application/shared/lock-service/testing/lock-usecase-test.helpers";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { behavesLikeAuthenticatedUsecase } from "@/features/shared/__tests__/behaves-like-authenticated-usecase.test";

describe("buildRefreshItemLockUsecase", () => {
  behavesLikeAuthenticatedUsecase(
    () =>
      buildRefreshItemLockUsecase({
        lockService: createMockLockService(),
      }),
    REFRESH_LOCK_INPUT,
    LOCK_AUTH_CONTEXT,
  );

  describe("item-specific behavior", () => {
    const lockService = createMockLockService();
    const useCase = buildRefreshItemLockUsecase({ lockService });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("refreshes tenant-scoped item lock with ownership token", async () => {
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

    it("returns ok: false when refresh is denied (stale or wrong token)", async () => {
      lockService.refresh.mockResolvedValue(false);

      const result = await runUsecase({
        useCase,
        input: REFRESH_LOCK_INPUT,
        authContext: LOCK_AUTH_CONTEXT,
      });

      expect(result).toEqual({ ok: false });
    });
  });
});
