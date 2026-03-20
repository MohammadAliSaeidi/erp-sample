import { Permission } from "../domain/types/permission.type";
import { hasPermissions } from "../domain/utils/has-permissions";

describe("hasPermissions", () => {
  const read = "items:read" as Permission;
  const create = "items:create" as Permission;
  const del = "items:delete" as Permission;

  it("returns true when user has the single required permission", () => {
    expect(hasPermissions([read, create], [read])).toBe(true);
  });

  it("returns true when user has all required permissions", () => {
    expect(hasPermissions([read, create, del], [read, create])).toBe(true);
  });

  it("returns false when user is missing one of the required permissions", () => {
    expect(hasPermissions([read], [read, create])).toBe(false);
  });

  it("returns false when user has no permissions at all", () => {
    expect(hasPermissions([], [read])).toBe(false);
  });

  it("returns true when no permissions are required (open route)", () => {
    expect(hasPermissions([], [])).toBe(true);
    expect(hasPermissions([read], [])).toBe(true);
  });

  it("is order-independent", () => {
    expect(hasPermissions([create, read], [read, create])).toBe(true);
  });

  it("does not match partial permission strings", () => {
    // "items" should not satisfy "items:read"
    expect(hasPermissions(["items" as Permission], [read])).toBe(false);
  });
});
