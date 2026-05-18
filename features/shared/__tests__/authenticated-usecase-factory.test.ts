import z from "zod";
import {
  AuthenticatedUsecaseDefinition,
  authenticatedUsecaseFactory,
} from "../application/use-case";
import { runUsecase } from "../application/run-use-case";
import { UseCaseForbiddenError } from "@/src/application/shared/errors/use-case-errors";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { brand } from "@/lib/brand";

export const MOCK_AUTH_CONTEXT: AuthContext = {
  adminId: brand("admin-1"),
  storeId: brand("store-1"),
  storeSlug: "store-1",
  username: "admin-user",
  roleId: "role-1",
  grantsAll: false,
  sub: "admin-1",
  exp: 9999999999,
  iat: 0,
  permissions: [],
};

describe("authenticatedUsecaseFactory", () => {
  const schema = z.object({
    name: z.string(),
  });

  const baseDefinition: AuthenticatedUsecaseDefinition<typeof schema, unknown> =
    {
      key: "test.usecase",
      auth: "required" as const,
      requiredPermissions: ["admins:create"],
      inputSchema: schema,
      execute: jest.fn(),
    };

  it("preserves all definition properties", () => {
    const usecase = authenticatedUsecaseFactory(baseDefinition);

    expect(usecase.key).toBe("test.usecase");
    expect(usecase.auth).toBe("required");
    expect(usecase.inputSchema).toBe(schema);
    expect(usecase.execute).toBe(baseDefinition.execute);
  });

  it("defaults requiredPermissions to empty array", () => {
    const usecase = authenticatedUsecaseFactory({
      ...baseDefinition,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      requiredPermissions: undefined as any,
    });

    expect(usecase.requiredPermissions).toEqual([]);
  });

  it("blocks execution when permission missing", async () => {
    const execute = jest.fn();

    const usecase = authenticatedUsecaseFactory({
      key: "test",
      auth: "required",
      requiredPermissions: ["categories:update"],
      inputSchema: z.object({}),
      execute,
    });

    await expect(
      runUsecase({
        useCase: usecase,
        input: {},
        authContext: {
          ...MOCK_AUTH_CONTEXT,
          grantsAll: false,
          permissions: [],
        },
      }),
    ).rejects.toBeInstanceOf(UseCaseForbiddenError);

    expect(execute).not.toHaveBeenCalled();
  });

  it("allows execution when grantsAll is true", async () => {
    const execute = jest.fn().mockResolvedValue("ok");

    const usecase = authenticatedUsecaseFactory({
      key: "test",
      auth: "required",
      requiredPermissions: ["categories:update"],
      inputSchema: z.object({}),
      execute,
    });

    const result = await runUsecase({
      useCase: usecase,
      input: {},
      authContext: {
        ...MOCK_AUTH_CONTEXT,
        grantsAll: true,
        permissions: [],
      },
    });

    expect(result).toBe("ok");
    expect(execute).toHaveBeenCalled();
  });

  it("throws when auth is required but missing", async () => {
    const usecase = authenticatedUsecaseFactory({
      key: "test",
      auth: "required",
      requiredPermissions: [],
      inputSchema: z.object({}),
      execute: jest.fn(),
    });

    await expect(
      runUsecase({
        useCase: usecase,
        input: {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        authContext: undefined as any,
      }),
    ).rejects.toBeDefined();
  });
});
