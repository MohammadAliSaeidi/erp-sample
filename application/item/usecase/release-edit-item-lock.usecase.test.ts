import { buildReleaseEditItemLockUsecase } from "@/application/item/usecase/release-edit-item-lock.usecase";
import {
  buildItemLockKey,
  createMockEventPublisher,
  createMockLockService,
  LOCK_AUTH_CONTEXT,
  LOCK_TOKEN,
  RELEASE_LOCK_INPUT,
} from "@/application/shared/lock-service/testing/lock-usecase-test.helpers";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { behavesLikeAuthenticatedUsecase } from "@/features/shared/__tests__/behaves-like-authenticated-usecase.test";

describe("buildReleaseEditItemLockUsecase", () => {
  behavesLikeAuthenticatedUsecase(
    () =>
      buildReleaseEditItemLockUsecase({
        lockService: createMockLockService(),
        eventPublisher: createMockEventPublisher(),
      }),
    RELEASE_LOCK_INPUT,
    LOCK_AUTH_CONTEXT,
  );

  describe("item-specific behavior", () => {
    const lockService = createMockLockService();
    const eventPublisher = createMockEventPublisher();

    const useCase = buildReleaseEditItemLockUsecase({
      lockService,
      eventPublisher,
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("releases with lock token against tenant-scoped item key", async () => {
      lockService.release.mockResolvedValue({ ok: true });

      const result = await runUsecase({
        useCase,
        input: RELEASE_LOCK_INPUT,
        authContext: LOCK_AUTH_CONTEXT,
      });

      expect(result).toEqual({ ok: true });
      expect(lockService.release).toHaveBeenCalledWith(
        buildItemLockKey("store-1", "item-1"),
        LOCK_TOKEN,
      );
    });

    it("publishes item.unlocked when release succeeds", async () => {
      lockService.release.mockResolvedValue({ ok: true });

      await runUsecase({
        useCase,
        input: RELEASE_LOCK_INPUT,
        authContext: LOCK_AUTH_CONTEXT,
      });

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

      const result = await runUsecase({
        useCase,
        input: RELEASE_LOCK_INPUT,
        authContext: LOCK_AUTH_CONTEXT,
      });

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
});
