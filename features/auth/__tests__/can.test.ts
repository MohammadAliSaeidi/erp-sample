import type { Permission } from "../domain/types/permission.type";
import { can } from "../domain/utils/can";

describe("can", () => {
	const userPermissions: Permission[] = ["items:read", "categories:create"];

	it("returns true for a single permitted action", () => {
		expect(can(userPermissions, "items:read")).toBe(true);
	});

	it("returns false for a single un-permitted action", () => {
		expect(can(userPermissions, "items:create")).toBe(false);
	});

	it("accepts an array of permissions and returns true when all are held", () => {
		expect(
			can(userPermissions, ["items:read", "categories:create"]),
		).toBe(true);
	});

	it("returns false when the user is missing any one of the required permissions", () => {
		expect(can(userPermissions, ["items:read", "items:create"])).toBe(
			false,
		);
	});

	it("returns false for an empty user permissions list", () => {
		expect(can([], "items:read")).toBe(false);
	});
});
