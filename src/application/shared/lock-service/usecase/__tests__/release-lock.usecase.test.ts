import { buildEvent } from "@/src/domain/shared/events/build-event";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildReleaseLockRequest } from "@/src/application/shared/lock-service/composition/lock-requests";
import { releaseLockUsecase } from "../release-lock.usecase";
import {
  buildItemLockKey,
  createMockEventPublisher,
  createMockLockService,
  ITEMS_UPDATE_PERMISSION,
  LOCK_BASE_CONTEXT,
  LOCK_STORE_AUTH_CONTEXT,
  LOCK_TOKEN,
  RELEASE_LOCK_INPUT,
} from "../../testing/lock-usecase-test.helpers";
import { InputValidationError } from "@/src/application/core/errors/input-validation.error";

describe("releaseLockUsecase", () => {
  const lockService = createMockLockService();
  const eventPublisher = createMockEventPublisher();
  const runner = buildUsecaseRunner();

  const deps = {
    lockService,
    eventPublisher,
    buildLockKey: buildItemLockKey,
    eventFactory: {
      released: (context: typeof LOCK_STORE_AUTH_CONTEXT, input: typeof RELEASE_LOCK_INPUT) =>
        buildEvent(
          "item.unlocked",
          {
            storeId: context.storeId,
            itemId: input.entityId,
            unlockedBy: context.adminId,
          },
          undefined,
        ),
      denied: (context: typeof LOCK_STORE_AUTH_CONTEXT, input: typeof RELEASE_LOCK_INPUT) =>
        buildEvent(
          "item.unlock.denied",
          {
            storeId: context.storeId,
            itemId: input.entityId,
          },
          undefined,
        ),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("releases using lock token and tenant-scoped key", async () => {
    lockService.release.mockResolvedValue({ ok: true });

    const result = await releaseLockUsecase.execute(
      RELEASE_LOCK_INPUT,
      LOCK_STORE_AUTH_CONTEXT,
      deps,
    );

    expect(result).toEqual({ ok: true });
    expect(lockService.release).toHaveBeenCalledWith(
      buildItemLockKey("store-1", "item-1"),
      LOCK_TOKEN,
    );
  });

  it("publishes item.unlocked when release succeeds via runner", async () => {
    lockService.release.mockResolvedValue({ ok: true });

    await runner.runWithInput(
      buildReleaseLockRequest(
        RELEASE_LOCK_INPUT,
        LOCK_BASE_CONTEXT,
        deps,
        [ITEMS_UPDATE_PERMISSION],
      ),
    );

    expect(eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: "item.unlocked" }),
    );
  });

  it("rejects empty entity id before calling lock service", async () => {
    await expect(
      runner.runWithInput(
        buildReleaseLockRequest(
          { entityId: "", lockToken: "token" },
          LOCK_BASE_CONTEXT,
          deps,
          [ITEMS_UPDATE_PERMISSION],
        ),
      ),
    ).rejects.toBeInstanceOf(InputValidationError);

    expect(lockService.release).not.toHaveBeenCalled();
  });
});
