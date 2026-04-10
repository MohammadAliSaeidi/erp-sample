import { authorize } from "../domain/authorize";
import { ForbiddenError } from "../domain/errors/forbidden.error";
import { UnauthorizedError } from "../domain/errors/unauthorized.error";
import { IJwtService } from "../domain/services/jwt.service";
import { Permission } from "../domain/types/permission.type";

const VALID_PAYLOAD = {
	adminId: "admin-1",
	storeId: "store-1",
	storeSlug: "store-1",
	username: "admin-user",
	roleId: "role-1",
	iat: 0,
	exp: 9999999999,
};

const VALID_PERMISSIONS: Permission[] = ["items:read", "items:create"];

const makeJwtService = (
	payload: Awaited<ReturnType<IJwtService["verify"]>>,
): Pick<IJwtService, "verify"> => ({
	verify: jest.fn().mockResolvedValue(payload),
});

describe("authorize (core)", () => {
	it("throws UnauthorizedError when token is missing", async () => {
		const run = authorize({
			getToken: async () => null,
			getPermissions: async () => VALID_PERMISSIONS,
			jwtService: makeJwtService(VALID_PAYLOAD),
		});

		await expect(run(["items:read"])).rejects.toBeInstanceOf(
			UnauthorizedError,
		);
	});

	it("throws UnauthorizedError when token payload is invalid", async () => {
		const run = authorize({
			getToken: async () => "token",
			getPermissions: async () => VALID_PERMISSIONS,
			jwtService: makeJwtService(null),
		});

		await expect(run(["items:read"])).rejects.toBeInstanceOf(
			UnauthorizedError,
		);
	});

	it("throws ForbiddenError when permissions are missing", async () => {
		const run = authorize({
			getToken: async () => "token",
			getPermissions: async () => ["items:read"],
			jwtService: makeJwtService(VALID_PAYLOAD),
		});

		await expect(run(["items:create"])).rejects.toBeInstanceOf(
			ForbiddenError,
		);
	});

	it("returns auth context when authorization succeeds", async () => {
		const run = authorize({
			getToken: async () => "token",
			getPermissions: async () => VALID_PERMISSIONS,
			jwtService: makeJwtService(VALID_PAYLOAD),
		});

		await expect(run(["items:read"])).resolves.toMatchObject({
			...VALID_PAYLOAD,
			permissions: VALID_PERMISSIONS,
		});
	});
});
