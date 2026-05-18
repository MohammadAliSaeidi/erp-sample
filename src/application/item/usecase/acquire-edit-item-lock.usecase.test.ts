import { buildAcquireEditItemLockUsecase } from "@/src/application/item/usecase/acquire-edit-item-lock.usecase";
import {
  ACQUIRE_LOCK_INPUT,
  buildItemLockKey,
  createMockEventPublisher,
  createMockLockService,
  LOCK_AUTH_CONTEXT,
  lockResultDenied,
  lockResultOk,
} from "@/src/application/shared/lock-service/testing/lock-usecase-test.helpers";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { behavesLikeAuthenticatedUsecase } from "@/features/shared/__tests__/behaves-like-authenticated-usecase.test";

describe("buildAcquireEditItemLockUsecase", () => {
  behavesLikeAuthenticatedUsecase(
    () =>
      buildAcquireEditItemLockUsecase({
        lockService: createMockLockService(),
        events: createMockEventPublisher(),
      }),
    ACQUIRE_LOCK_INPUT,
    LOCK_AUTH_CONTEXT,
  );

  describe("item-specific behavior", () => {
    const lockService = createMockLockService();
    const events = createMockEventPublisher();

    const useCase = buildAcquireEditItemLockUsecase({
      lockService,
      events,
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("scopes lock key to authenticated store and item entity", async () => {
      lockService.acquire.mockResolvedValue(lockResultOk());

      await runUsecase({
        useCase,
        input: ACQUIRE_LOCK_INPUT,
        authContext: LOCK_AUTH_CONTEXT,
      });

      expect(lockService.acquire).toHaveBeenCalledWith(
        buildItemLockKey("store-1", "item-1"),
        LOCK_AUTH_CONTEXT.adminId,
        ACQUIRE_LOCK_INPUT.ttlMs,
      );
    });

    it("publishes item.locked with token for successful acquisition", async () => {
      const acquired = lockResultOk();
      lockService.acquire.mockResolvedValue(acquired);

      await runUsecase({
        useCase,
        input: ACQUIRE_LOCK_INPUT,
        authContext: LOCK_AUTH_CONTEXT,
      });

      expect(events.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "item.locked",
          payload: expect.objectContaining({
            storeId: "store-1",
            itemId: "item-1",
            lockedBy: "admin-1",
            token: acquired.token,
          }),
        }),
      );
    });

    it("publishes item.lock.denied when another admin holds the lock", async () => {
      lockService.acquire.mockResolvedValue(
        lockResultDenied({ lockedBy: "other-admin" }),
      );

      const result = await runUsecase({
        useCase,
        input: ACQUIRE_LOCK_INPUT,
        authContext: LOCK_AUTH_CONTEXT,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.lockedBy).toBe("other-admin");
      }
      expect(events.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "item.lock.denied",
          payload: expect.objectContaining({
            storeId: "store-1",
            itemId: "item-1",
            requestedBy: "admin-1",
            lockedBy: "other-admin",
          }),
        }),
      );
    });
  });
});
