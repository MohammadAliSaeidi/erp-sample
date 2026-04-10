import { buildRequireSsrAuth } from "../domain/lib/require-ssr-auth";
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

describe("buildRequireSsrAuth", () => {
  it("throws UnauthorizedError when token does not exist", async () => {
    const requireSsrAuth = buildRequireSsrAuth({
      jwtService: makeJwtService(VALID_PAYLOAD),
      getPermissionsByRoleId: async () => VALID_PERMISSIONS,
      getToken: async () => null,
    });

    await expect(requireSsrAuth(["items:read"])).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });

  it("throws ForbiddenError when role misses permission", async () => {
    const requireSsrAuth = buildRequireSsrAuth({
      jwtService: makeJwtService(VALID_PAYLOAD),
      getPermissionsByRoleId: async () => ["items:read"],
      getToken: async () => "valid-token",
    });

    await expect(requireSsrAuth(["items:create"])).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it("returns auth context when successful", async () => {
    const requireSsrAuth = buildRequireSsrAuth({
      jwtService: makeJwtService(VALID_PAYLOAD),
      getPermissionsByRoleId: async () => VALID_PERMISSIONS,
      getToken: async () => "valid-token",
    });

    await expect(requireSsrAuth(["items:read"])).resolves.toMatchObject({
      ...VALID_PAYLOAD,
      permissions: VALID_PERMISSIONS,
    });
  });
});
