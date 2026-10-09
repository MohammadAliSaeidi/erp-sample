import {
	ForbiddenError,
	UnauthorizedError,
} from "@/src/application/core/errors/application.error";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { itemLockDeps } from "@/src/application/item/composition/item-lock-deps";
import { buildAcquireLockRequest } from "@/src/application/shared/lock-service/composition/lock-requests";
import {
	ACQUIRE_LOCK_INPUT,
	buildItemLockKey,
	createMockEventPublisher,
	createMockLockService,
	LOCK_AUTH_CONTEXT,
	LOCK_BASE_CONTEXT,
	lockResultDenied,
	lockResultOk,
} from "@/src/application/shared/lock-service/testing/lock-usecase-test.helpers";
import { PERMISSIONS } from "@/src/domain/permission/permissions";

describe("acquire edit item lock", () => {
	const runner = buildUsecaseRunner();

	describe("item-specific behavior", () => {
		const lockService = createMockLockService();
		const events = createMockEventPublisher();

		const deps = {
			...itemLockDeps.acquire,
			lockService,
			eventPublisher: events,
		};

		beforeEach(() => {
			jest.clearAllMocks();
		});

		it("scopes lock key to authenticated store and item entity", async () => {
			lockService.acquire.mockResolvedValue(lockResultOk());

			await runner.runWithInput(
				buildAcquireLockRequest(
					ACQUIRE_LOCK_INPUT,
					LOCK_BASE_CONTEXT,
					deps,
					[PERMISSIONS.ITEMS.UPDATE],
				),
			);

			expect(lockService.acquire).toHaveBeenCalledWith(
				buildItemLockKey("store-1", "item-1"),
				LOCK_AUTH_CONTEXT.adminId,
				ACQUIRE_LOCK_INPUT.ttlMs,
			);
		});

		it("publishes item.locked with token for successful acquisition", async () => {
			const acquired = lockResultOk();
			lockService.acquire.mockResolvedValue(acquired);

			await runner.runWithInput(
				buildAcquireLockRequest(
					ACQUIRE_LOCK_INPUT,
					LOCK_BASE_CONTEXT,
					deps,
					[PERMISSIONS.ITEMS.UPDATE],
				),
			);

			expect(events.publish).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "item.locked",
					payload: expect.objectContaining({
						storeId: "store-1",
						itemId: "item-1",
						lockedBy: "admin-1",
						token: acquired.lockToken,
					}),
				}),
			);
		});

		it("publishes item.lock.denied when another admin holds the lock", async () => {
			lockService.acquire.mockResolvedValue(
				lockResultDenied({ lockedBy: "other-admin" }),
			);

			const result = await runner.runWithInput(
				buildAcquireLockRequest(
					ACQUIRE_LOCK_INPUT,
					LOCK_BASE_CONTEXT,
					deps,
					[PERMISSIONS.ITEMS.UPDATE],
				),
			);

			expect(result.ok).toBe(false);
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

	describe("auth policies", () => {
		it("rejects callers without store auth metadata", async () => {
			await expect(
				runner.runWithInput(
					buildAcquireLockRequest(
						ACQUIRE_LOCK_INPUT,
						{ requestId: "req-1", timestamp: new Date() },
						itemLockDeps.acquire,
						[PERMISSIONS.ITEMS.UPDATE],
					),
				),
			).rejects.toBeInstanceOf(UnauthorizedError);
		});

		it("rejects callers without update permission", async () => {
			await expect(
				runner.runWithInput(
					buildAcquireLockRequest(
						ACQUIRE_LOCK_INPUT,
						{
							...LOCK_BASE_CONTEXT,
							metadata: {
								...LOCK_BASE_CONTEXT.metadata,
								permissions: [],
							},
						},
						itemLockDeps.acquire,
						[PERMISSIONS.ITEMS.UPDATE],
					),
				),
			).rejects.toBeInstanceOf(ForbiddenError);
		});
	});
});
