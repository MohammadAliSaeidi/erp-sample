import { brand } from "@/lib/brand";
import {
  requireSpecificationCreatePermission,
  validateCreateSpecificationInput,
} from "@/src/application/specification/policy/specification.policies";
import {
  createSpecificationUsecase,
  type CreateSpecificationUsecaseDeps,
} from "@/src/application/specification/usecase/create-specification.usecase";
import { buildRunWithInputRequest } from "@/src/application/core/usecase/factories";
import { createRequireStoreAuthPolicy } from "@/src/application/core/usecase/policies/common-policies";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import type {
  BaseContext,
  StoreAuthContext,
} from "@/src/application/core/usecase/types/context.types";
import { Specification } from "@/src/domain/specification/aggregates/specification.aggregate";
import { SpecificationValueType } from "@/src/domain/specification/specification-value-type.enum";
import type { ISpecificationRepositoryPort } from "@/src/domain/specification/specification-repository.port";

const CATEGORY_ID = "018f3c8a-0000-7000-8000-000000000022";

const storeAuthContext: StoreAuthContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  storeId: "store-1",
  adminId: "admin-1",
  grantsAll: false,
  permissions: ["specifications:create"],
};

const baseContext: BaseContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  metadata: {
    storeId: "store-1",
    adminId: "admin-1",
    grantsAll: false,
    permissions: ["specifications:create"],
  },
};

const validInput = {
  name: "Color",
  categoryId: CATEGORY_ID,
  type: SpecificationValueType.STRING,
  isRequired: true,
  isPrimary: false,
  specificationValues: [{ value: "Red" }],
};

function createDeps(
  overrides: Partial<CreateSpecificationUsecaseDeps> = {},
): CreateSpecificationUsecaseDeps {
  const persisted = Specification.create({
    name: "Color",
    categoryId: brand<string, "CategoryId">(CATEGORY_ID),
    storeId: brand<string, "StoreId">("store-1"),
    type: SpecificationValueType.STRING,
    isRequired: true,
    isPrimary: false,
    specificationValues: [{ value: "Red" }],
    generateValueId: () => "value-1",
  });

  return {
    idGenerator: {
      generate: jest.fn(() => "spec-1"),
      ...overrides.idGenerator,
    },
    specificationRepository: {
      create: jest.fn(async () => persisted),
      ...overrides.specificationRepository,
    },
  };
}

describe("createSpecificationUsecase.execute", () => {
  it("creates a specification for the authenticated store", async () => {
    const deps = createDeps();

    const output = await createSpecificationUsecase.execute(
      validInput,
      storeAuthContext,
      deps,
    );

    expect(output.name).toBe("Color");
    expect(deps.specificationRepository.create).toHaveBeenCalled();
  });
});

describe("createSpecificationUsecase via runner", () => {
  const runner = buildUsecaseRunner();
  const requireStoreAuth = createRequireStoreAuthPolicy();

  it("creates through validated input", async () => {
    const deps = createDeps();

    const output = await runner.runWithInput(
      buildRunWithInputRequest({
        usecase: createSpecificationUsecase,
        input: validInput,
        context: baseContext,
        deps,
        beforePolicies: [
          validateCreateSpecificationInput,
          requireStoreAuth,
          requireSpecificationCreatePermission,
        ] as const,
      }),
    );

    expect(output.name).toBe("Color");
  });
});
