import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { UseCaseForbiddenError } from "@/src/application/shared/errors/use-case-errors";
import { brand } from "@/lib/brand";
import { z } from "zod";

const authContext: AuthContext = {
  adminId: brand("admin-1"),
  storeId: brand("store-1"),
  storeSlug: "store-1",
  username: "tester",
  roleId: "role-1",
  grantsAll: false,
  sub: "admin-1",
  exp: 9_999_999_999,
  iat: 0,
  permissions: ["items:update"],
};

const requireSsrAuth = jest.fn();
const runUsecase = jest.fn();

jest.mock("../../../features/auth", () => ({
  requireSsrAuth: (...args: unknown[]) => requireSsrAuth(...args),
}));

jest.mock("../../../features/shared/application/run-use-case", () => ({
  runUsecase: (...args: unknown[]) => runUsecase(...args),
}));

import { runAuthenticatedAction } from "./run-authenticated-action";

describe("runAuthenticatedAction", () => {
  const useCase = {
    key: "test.action",
    auth: "required" as const,
    requiredPermissions: ["items:update" as const],
    inputSchema: z.object({ id: z.string() }),
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    requireSsrAuth.mockResolvedValue(authContext);
  });

  it("returns action success with use case result", async () => {
    runUsecase.mockResolvedValue({ id: "item-1" });

    const result = await runAuthenticatedAction({
      useCase,
      input: { id: "item-1" },
      auth: { storeSlug: "store-1" },
    });

    expect(requireSsrAuth).toHaveBeenCalledWith({ storeSlug: "store-1" });
    expect(runUsecase).toHaveBeenCalledWith({
      useCase,
      input: { id: "item-1" },
      authContext,
    });
    expect(result).toEqual({ ok: true, data: { id: "item-1" } });
  });

  it("maps use case errors to action failures", async () => {
    runUsecase.mockRejectedValue(new UseCaseForbiddenError("forbidden"));

    const result = await runAuthenticatedAction({
      useCase,
      input: { id: "item-1" },
    });

    expect(result).toMatchObject({
      ok: false,
      error: { code: "forbidden", message: "forbidden" },
    });
  });
});
