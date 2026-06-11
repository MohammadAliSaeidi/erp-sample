import { loginDeps } from "@/src/application/auth/composition/login-deps";
import { buildLoginRequest } from "@/src/application/auth/composition/login-request";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/src/application/core/errors/application.error";
import { InputValidationError } from "@/src/application/core/errors/input-validation.error";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildPublicRequestContext } from "@/src/interface/http/build-public-request-context";

describe("login operation", () => {
  const runner = buildUsecaseRunner();
  const context = buildPublicRequestContext();

  it("validates required input fields", async () => {
    await expect(
      runner.runWithInput(
        buildLoginRequest(
          {
            username: "admin",
            password: "1234",
          },
          context,
          loginDeps,
        ),
      ),
    ).rejects.toBeInstanceOf(InputValidationError);
  });

  it("throws NotFoundError when store does not exist", async () => {
    await expect(
      runner.runWithInput(
        buildLoginRequest(
          {
            storeSlug: "missing-store",
            username: "admin",
            password: "1234",
          },
          context,
          {
            ...loginDeps,
            findStoreBySlug: jest.fn().mockResolvedValue(null),
          },
        ),
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws UnauthorizedError for invalid credentials", async () => {
    await expect(
      runner.runWithInput(
        buildLoginRequest(
          {
            storeSlug: "store-1",
            username: "admin",
            password: "bad-pass",
          },
          context,
          {
            ...loginDeps,
            findStoreBySlug: jest
              .fn()
              .mockResolvedValue({ id: "store-1", slug: "store-1" }),
            findStoreUserByStoreAndUsername: jest.fn().mockResolvedValue({
              id: "user-1",
              name: "Admin",
              storeId: "store-1",
              username: "admin",
              roleId: "role-1",
              password: "hashed-password",
              grantsAll: false,
            }),
            isPasswordMatch: jest.fn().mockResolvedValue(false),
          },
        ),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("returns token payload and cookie name when credentials are valid", async () => {
    await expect(
      runner.runWithInput(
        buildLoginRequest(
          {
            storeSlug: "store-1",
            username: "admin",
            password: "correct-pass",
          },
          context,
          {
            ...loginDeps,
            findStoreBySlug: jest
              .fn()
              .mockResolvedValue({ id: "store-1", slug: "store-1" }),
            findStoreUserByStoreAndUsername: jest.fn().mockResolvedValue({
              id: "user-1",
              name: "Admin",
              storeId: "store-1",
              username: "admin",
              roleId: "role-1",
              password: "hashed-password",
              grantsAll: false,
            }),
            isPasswordMatch: jest.fn().mockResolvedValue(true),
          },
        ),
      ),
    ).resolves.toMatchObject({
      cookieName: "ADMIN_ACCESS_TOKEN_COOKIE_STORE_1",
      tokenPayload: {
        sub: "user-1",
        adminId: "user-1",
        storeId: "store-1",
        storeSlug: "store-1",
        username: "admin",
        roleId: "role-1",
      },
    });
  });
});
