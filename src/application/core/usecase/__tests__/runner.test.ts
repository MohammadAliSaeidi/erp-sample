import { defineBeforePolicy, defineUsecase } from "@/src/application/core/usecase/factories";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";

type TestContext = BaseContext & {
  readonly storeId: string;
};

const baseContext: TestContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  storeId: "store-1",
};

describe("buildUsecaseRunner", () => {
  const runner = buildUsecaseRunner();

  it("executes a usecase with input, context, and deps", async () => {
    const usecase = defineUsecase<
      { name: string },
      { id: string; name: string },
      TestContext,
      { prefix: string }
    >(async (input, _context, deps) => ({
      id: "generated-id",
      name: `${deps.prefix}:${input.name}`,
    }));

    const output = await runner.runWithInput({
      usecase,
      input: { name: "Beverages" },
      context: baseContext,
      deps: { prefix: "cat" },
    });

    expect(output).toEqual({ id: "generated-id", name: "cat:Beverages" });
  });

  it("runs before policies to refine input and context", async () => {
    const enrichContext = defineBeforePolicy<
      TestContext,
      TestContext & { readonly actorId: string },
      { name: string },
      { name: string }
    >("enrich-context", async (input, context) => ({
      input,
      context: { ...context, actorId: "admin-1" },
    }));

    const usecase = defineUsecase<
      { name: string },
      string,
      TestContext & { readonly actorId: string },
      Record<string, never>
    >(async (input, context) => `${context.actorId}:${input.name}`);

    const output = await runner.runWithInput({
      usecase,
      input: { name: "Food" },
      context: baseContext,
      deps: {},
      beforePolicies: [enrichContext] as const,
    });

    expect(output).toBe("admin-1:Food");
  });
});
