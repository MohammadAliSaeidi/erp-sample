import { buildEvent } from "@/domain/shared/events/build-event";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { UseCaseValidationError } from "@/application/errors/use-case-errors";
import { brand } from "@/lib/brand";
import { buildReleaseLockUsecase } from "./release-lock.usecase";
import {
  buildItemLockKey,
  createMockEventPublisher,
  createMockLockService,
  ITEMS_UPDATE_PERMISSION,
  LOCK_AUTH_CONTEXT,
  LOCK_TOKEN,
  RELEASE_LOCK_INPUT,
} from "../testing/lock-usecase-test.helpers";

describe("buildReleaseLockUsecase", () => {
  const lockService = createMockLockService();
  const eventPublisher = createMockEventPublisher();

  const useCase = buildReleaseLockUsecase({
    key: "test.release-lock",
    requiredPermissions: [ITEMS_UPDATE_PERMISSION],
    lockService,
    eventPublisher,
    buildLockKey: buildItemLockKey,
    eventFactory: {
      released: (ctx, input) =>
        buildEvent(
          "item.unlocked",
          {
            storeId: String(ctx.storeId),
            itemId: input.entityId,
            unlockedBy: brand<string, "AdminId">(String(ctx.adminId)),
          },
          undefined,
        ),
      denied: (ctx, input) =>
        buildEvent(
          "item.unlock.denied",
          {
            storeId: String(ctx.storeId),
            itemId: input.entityId,
          },
          undefined,
        ),
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("releases using lock token (not admin id) and tenant-scoped key", async () => {
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
    expect(lockService.release).not.toHaveBeenCalledWith(
      expect.anything(),
      brand<string, "LockToken">(LOCK_AUTH_CONTEXT.adminId),
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
      expect.objectContaining({ type: "item.unlocked" }),
    );
  });

  it("publishes item.unlock.denied when token is stale or mismatched", async () => {
    lockService.release.mockResolvedValue({ ok: false });

    const result = await runUsecase({
      useCase,
      input: RELEASE_LOCK_INPUT,
      authContext: LOCK_AUTH_CONTEXT,
    });

    expect(result).toEqual({ ok: false });
    expect(eventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: "item.unlock.denied" }),
    );
  });

  it("rejects empty entity id before calling lock service", async () => {
    await expect(
      runUsecase({
        useCase,
        input: { entityId: "", lockToken: "token" },
        authContext: LOCK_AUTH_CONTEXT,
      }),
    ).rejects.toBeInstanceOf(UseCaseValidationError);

    expect(lockService.release).not.toHaveBeenCalled();
  });
});
