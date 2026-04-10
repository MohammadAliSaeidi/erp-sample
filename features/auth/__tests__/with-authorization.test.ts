import { buildWithAuthorization } from "../adapters/route/with-authorization/build-with-authorization";
import { IJwtService } from "../domain/services/jwt.service";
import { IPermissionService } from "../domain/services/permission.service";
import { AuthContext } from "../domain/types/auth-context.type";
import { Permission } from "../domain/types/permission.type";

const VALID_PAYLOAD = {
	adminId: "admin-1",
	storeId: "store-1",
	storeSlug: "store-1",
	username: "admin-user",
	roleId: "role-1",
	iat: 0,
	exp: 9999999999,
} as const;

const VALID_PERMISSIONS: Permission[] = ["items:read", "items:create"];

const makeRequest = (token: string | null = "valid-token") =>
	({
		cookies: {
			get: jest.fn((name: string) =>
				name === "ADMIN_ACCESS_TOKEN_COOKIE_STORE_1"
					? { value: token }
					: undefined,
			),
			getAll: jest.fn(() => [
				{
					name: "ADMIN_ACCESS_TOKEN_COOKIE_STORE_1",
					value: token ?? "",
				},
			]),
		},
		headers: {
			get: jest.fn((name: string) => {
				if (name === "x-store-slug") return "store-1";
				return null;
			}),
		},
	}) as unknown as Parameters<IJwtService["extractFromRequest"]>[0];

const makeMockJwtService = (
	result: Awaited<ReturnType<IJwtService["verify"]>>,
): IJwtService => ({
	extractFromRequest: jest.fn(),
	sign: jest.fn(),
	verify: jest.fn().mockResolvedValue(result),
});

const makeMockPermissionService = (
	permissions: Permission[] = VALID_PERMISSIONS,
): IPermissionService => ({
	getPermissionsByRoleId: jest.fn().mockResolvedValue(permissions),
	getCachedPermissionsByRoleId: jest.fn().mockResolvedValue(permissions),
	invalidatePermissionsCache: jest.fn(),
	invalidateAllPermissionsCache: jest.fn(),
});

describe("buildWithAuthorization", () => {
	beforeAll(() => {
		(
			globalThis as unknown as {
				Response: {
					json: (...args: unknown[]) => { status: number };
				};
			}
		).Response = {
			json: (...args: unknown[]) => {
				const init = args[1] as { status?: number } | undefined;
				return {
					status: init?.status ?? 200,
				};
			},
		};
	});

	describe("when token is missing or invalid", () => {
		it("returns 401 without hitting permission service", async () => {
			const jwtService = makeMockJwtService(null);
			const permissionService = makeMockPermissionService();
			const handler = buildWithAuthorization(
				jwtService,
				permissionService,
			)(["items:read"])(jest.fn());

			const res = await handler(makeRequest(null), {});

			expect(res.status).toBe(401);
			expect(
				permissionService.getPermissionsByRoleId,
			).not.toHaveBeenCalled();
		});
	});

	describe("when role lacks required permissions", () => {
		it("returns 403", async () => {
			const jwtService = makeMockJwtService(VALID_PAYLOAD);
			const permissionService = makeMockPermissionService([
				"items:read",
			]);
			const handler = buildWithAuthorization(
				jwtService,
				permissionService,
			)(["items:create"])(jest.fn());

			const res = await handler(makeRequest(), {});

			expect(res.status).toBe(403);
			expect(
				permissionService.getPermissionsByRoleId,
			).toHaveBeenCalledWith(VALID_PAYLOAD.roleId);
		});
	});

	describe("when authorization succeeds", () => {
		it("lets the inner handler run", async () => {
			const jwtService = makeMockJwtService(VALID_PAYLOAD);
			const permissionService =
				makeMockPermissionService(VALID_PERMISSIONS);
			const innerHandler = jest
				.fn()
				.mockResolvedValue({ status: 200 } as Response);
			const handler = buildWithAuthorization(
				jwtService,
				permissionService,
			)(VALID_PERMISSIONS)(innerHandler);

			const res = await handler(makeRequest(), {});

			expect(innerHandler).toHaveBeenCalledTimes(1);
			expect(res.status).toBe(200);
		});

		it("forwards resolved auth context on request.authContext", async () => {
			const jwtService = makeMockJwtService(VALID_PAYLOAD);
			const permissionService =
				makeMockPermissionService(VALID_PERMISSIONS);
			let capturedAuth: AuthContext | null = null;

			const innerHandler = jest.fn().mockImplementation((req) => {
				capturedAuth =
					(req as { authContext?: AuthContext }).authContext ??
					null;
				return { status: 200 } as Response;
			});

			const handler = buildWithAuthorization(
				jwtService,
				permissionService,
			)(["items:read"])(innerHandler);

			await handler(makeRequest(), {});

			expect(capturedAuth).toMatchObject({
				adminId: VALID_PAYLOAD.adminId,
				storeId: VALID_PAYLOAD.storeId,
				storeSlug: VALID_PAYLOAD.storeSlug,
				username: VALID_PAYLOAD.username,
				roleId: VALID_PAYLOAD.roleId,
				permissions: VALID_PERMISSIONS,
			});
		});
	});
});
