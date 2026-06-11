import {
  NotFoundError,
  UnauthorizedError,
} from "@/src/application/core/errors/application.error";
import { InputValidationError } from "@/src/application/core/errors/input-validation.error";
import { buildRunWithInputRequest } from "@/src/application/core/usecase/factories";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";
import { validateLoginInput } from "@/src/application/auth/policy/auth.policies";
import {
  loginUsecase,
  type LoginUsecaseDeps,
} from "@/src/application/auth/usecase/login.usecase";

const baseContext: BaseContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
};

function createDeps(
  overrides: Partial<LoginUsecaseDeps> = {},
): LoginUsecaseDeps {
  return {
    findStoreBySlug: jest.fn(),
    findStoreUserByStoreAndUsername: jest.fn(),
    isPasswordMatch: jest.fn(),
    ...overrides,
  };
}

describe("loginUsecase", () => {
  const runner = buildUsecaseRunner();

  it("returns token payload and cookie name when credentials are valid", async () => {
    const deps = createDeps({
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
    });

    const result = await loginUsecase.execute(
      {
        storeSlug: "store-1",
        username: "admin",
        password: "correct-pass",
      },
      baseContext,
      deps,
    );

    expect(result).toMatchObject({
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

  it("throws NotFoundError when store does not exist", async () => {
    const deps = createDeps({
      findStoreBySlug: jest.fn().mockResolvedValue(null),
    });

    await expect(
      loginUsecase.execute(
        {
          storeSlug: "missing-store",
          username: "admin",
          password: "1234",
        },
        baseContext,
        deps,
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws UnauthorizedError for invalid credentials", async () => {
    const deps = createDeps({
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
    });

    await expect(
      loginUsecase.execute(
        {
          storeSlug: "store-1",
          username: "admin",
          password: "bad-pass",
        },
        baseContext,
        deps,
      ),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});

describe("loginUsecase via runner", () => {
  const runner = buildUsecaseRunner();

  it("rejects invalid input before execution", async () => {
    const deps = createDeps();

    await expect(
      runner.runWithInput(
        buildRunWithInputRequest({
          usecase: loginUsecase,
          input: { username: "admin", password: "1234" },
          context: baseContext,
          deps,
          beforePolicies: [validateLoginInput] as const,
        }),
      ),
    ).rejects.toBeInstanceOf(InputValidationError);
  });
});
