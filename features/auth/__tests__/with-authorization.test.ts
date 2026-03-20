import { IJwtService } from "../domain/services/jwt.service";
import { IPermissionService } from "../domain/services/permission.service";
import { AuthContext } from "../domain/types/auth-context.type";
import { Permission } from "../domain/types/permission.type";
import { hasPermissions } from "../domain/utils/has-permissions";
import { buildWithAuthorization } from "../domain/utils/with-authorization";

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

const makeRequest = () =>
  ({}) as Parameters<IJwtService["extractFromRequest"]>[0];

const makeMockJwtService = (
  result: Awaited<ReturnType<IJwtService["extractFromRequest"]>>,
): IJwtService => ({
  extractFromRequest: jest.fn().mockResolvedValue(result),
  sign: jest.fn(),
});

const makeMockPermissionService = (
  permissions: Permission[] = VALID_PERMISSIONS,
): IPermissionService => ({
  getPermissionsByRoleId: jest.fn().mockResolvedValue(permissions),
  getCachedPermissionsByRoleId: jest.fn().mockResolvedValue(permissions),
  invalidatePermissionsCache: jest.fn(),
  invalidateAllPermissionsCache: jest.fn(),
});

describe("makeWithAuthorization", () => {
  describe("when the JWT is missing or invalid", () => {
    it("returns 401 without hitting the permission service", async () => {
      const jwtService = makeMockJwtService(null);
      const permissionService = makeMockPermissionService();
      const handler = buildWithAuthorization(
        jwtService,
        permissionService,
      )(["items:read"])(jest.fn());

      const res = await handler(makeRequest(), {});

      expect(res.status).toBe(401);
      expect(permissionService.getPermissionsByRoleId).not.toHaveBeenCalled();
    });
  });

  describe("when the JWT is valid but the role lacks permissions", () => {
    it("returns 403", async () => {
      const jwtService = makeMockJwtService(VALID_PAYLOAD);
      const permissionService = makeMockPermissionService(["items:read"]);
      const handler = buildWithAuthorization(
        jwtService,
        permissionService,
      )(["items:create"])(jest.fn());

      const res = await handler(makeRequest(), {});

      expect(res.status).toBe(403);
      expect(permissionService.getPermissionsByRoleId).toHaveBeenCalledWith(
        VALID_PAYLOAD.roleId,
      );
    });
  });

  describe("when the JWT is valid and permissions satisfy the requirements", () => {
    it("lets the inner handler run", async () => {
      const jwtService = makeMockJwtService(VALID_PAYLOAD);
      const permissionService = makeMockPermissionService(VALID_PERMISSIONS);
      const innerHandler = jest
        .fn()
        .mockResolvedValue(Response.json({ data: "ok" }, { status: 200 }));
      const handler = buildWithAuthorization(
        jwtService,
        permissionService,
      )(VALID_PERMISSIONS)(innerHandler);

      const res = await handler(makeRequest(), {});

      expect(innerHandler).toHaveBeenCalledTimes(1);
      expect(res.status).toBe(200);
    });

    it("forwards the resolved auth context", async () => {
      const jwtService = makeMockJwtService(VALID_PAYLOAD);
      const permissionService = makeMockPermissionService(VALID_PERMISSIONS);
      let capturedAuth: AuthContext | null = null;

      const innerHandler = jest.fn().mockImplementation((_req, _ctx, data) => {
        capturedAuth = data.auth;
        return Response.json({ ok: true });
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

  describe("when no permissions are required", () => {
    it("treats the route as open once authenticated", async () => {
      const jwtService = makeMockJwtService(VALID_PAYLOAD);
      const permissionService = makeMockPermissionService(["items:read"]);
      const innerHandler = jest.fn().mockResolvedValue(new Response("ok"));
      const handler = buildWithAuthorization(jwtService, permissionService)([])(
        innerHandler,
      );

      await handler(makeRequest(), {});

      expect(innerHandler).toHaveBeenCalledTimes(1);
    });
  });
});

describe("hasPermissions", () => {
  it("returns true when no permissions are required", () => {
    expect(hasPermissions(["items:read"], [])).toBe(true);
  });

  it("returns true when the user has every required permission", () => {
    expect(
      hasPermissions(["items:read", "items:create"], ["items:create"]),
    ).toBe(true);
  });

  it("returns false when the user is missing a required permission", () => {
    expect(hasPermissions(["items:read"], ["items:delete"])).toBe(false);
  });
});
