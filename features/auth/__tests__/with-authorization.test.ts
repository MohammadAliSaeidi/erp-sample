import { buildWithAuthorization } from "../adapters/route/with-authorization/build-with-authorization";
import { ResolveAuthContext } from "@/application/auth/resolve-auth-context";
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
	grantsAll: false,
	sub: "admin-1",
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
	}) as unknown as import("next/server").NextRequest;

describe("buildWithAuthorization", () => {
	it("invokes handler with authContext from resolver (permissions arg ignored)", async () => {
		const resolveAuthContext: ResolveAuthContext = jest.fn().mockResolvedValue({
			...VALID_PAYLOAD,
			permissions: VALID_PERMISSIONS,
		});
		const innerHandler = jest
			.fn()
			.mockResolvedValue({ status: 200 } as Response);
		const handler = buildWithAuthorization(resolveAuthContext)([
			"items:create",
		])(innerHandler);

		const res = await handler(makeRequest(), {});

		expect(innerHandler).toHaveBeenCalledTimes(1);
		expect(res.status).toBe(200);
		expect(resolveAuthContext).toHaveBeenCalledWith({
			storeSlug: "store-1",
			token: "valid-token",
		});
	});

	it("forwards resolved auth context on request.authContext", async () => {
		const resolveAuthContext: ResolveAuthContext = jest.fn().mockResolvedValue({
			...VALID_PAYLOAD,
			permissions: VALID_PERMISSIONS,
		});
		let capturedAuth: AuthContext | null = null;

		const innerHandler = jest.fn().mockImplementation((req) => {
			capturedAuth =
				(req as { authContext?: AuthContext }).authContext ?? null;
			return { status: 200 } as Response;
		});

		const handler = buildWithAuthorization(resolveAuthContext)(["items:read"])(
			innerHandler,
		);

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

	it("passes null authContext when resolver returns null", async () => {
		const resolveAuthContext: ResolveAuthContext = jest
			.fn()
			.mockResolvedValue(null);
		let capturedAuth: AuthContext | null | undefined;
		const innerHandler = jest.fn().mockImplementation((req) => {
			capturedAuth = (req as { authContext?: AuthContext | null }).authContext;
			return { status: 200 } as Response;
		});
		const handler = buildWithAuthorization(resolveAuthContext)([])(innerHandler);

		await handler(makeRequest(null), {});

		expect(capturedAuth).toBeNull();
	});
});
