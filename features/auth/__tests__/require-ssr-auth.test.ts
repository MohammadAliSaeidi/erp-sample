import { buildRequireSsrAuth } from "@/application/auth/required-ssr-auth";
import { ResolveAuthContext } from "@/application/auth/resolve-auth-context";
import { UseCaseUnauthorizedError } from "@/features/shared/application/errors/use-case-errors";
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

describe("buildRequireSsrAuth", () => {
	it("throws UseCaseUnauthorizedError when resolver returns null", async () => {
		const resolveAuthContext: ResolveAuthContext = async () => null;
		const requireSsrAuth = buildRequireSsrAuth(resolveAuthContext);

		await expect(requireSsrAuth()).rejects.toBeInstanceOf(
			UseCaseUnauthorizedError,
		);
	});

	it("returns auth context when resolver succeeds", async () => {
		const resolveAuthContext: ResolveAuthContext = async () => ({
			...VALID_PAYLOAD,
			permissions: VALID_PERMISSIONS,
		});
		const requireSsrAuth = buildRequireSsrAuth(resolveAuthContext);

		await expect(requireSsrAuth()).resolves.toMatchObject({
			...VALID_PAYLOAD,
			permissions: VALID_PERMISSIONS,
		});
	});

	it("forwards storeSlug to resolver", async () => {
		const resolveAuthContext: ResolveAuthContext = jest
			.fn()
			.mockResolvedValue({ ...VALID_PAYLOAD, permissions: [] });
		const requireSsrAuth = buildRequireSsrAuth(resolveAuthContext);

		await requireSsrAuth({ storeSlug: "acme" });

		expect(resolveAuthContext).toHaveBeenCalledWith({ storeSlug: "acme" });
	});
});
