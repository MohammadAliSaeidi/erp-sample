import { brand } from "@/lib/brand";
import {
  requireSpecificationReadPermission,
  validateGetCategorySpecificationsInput,
} from "@/src/application/specification/policy/specification.policies";
import {
  getCategorySpecificationsUsecase,
  type GetCategorySpecificationsUsecaseDeps,
} from "@/src/application/specification/usecase/get-category-specifications.usecase";
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

const CATEGORY_ID = "018f3c8a-0000-7000-8000-000000000023";

const storeAuthContext: StoreAuthContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  storeId: "store-1",
  adminId: "admin-1",
  grantsAll: false,
  permissions: ["specifications:read"],
};

const baseContext: BaseContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  metadata: {
    storeId: "store-1",
    adminId: "admin-1",
    grantsAll: false,
    permissions: ["specifications:read"],
  },
};

function createDeps(
  overrides: Partial<GetCategorySpecificationsUsecaseDeps> = {},
): GetCategorySpecificationsUsecaseDeps {
  const specifications = [
    Specification.rehydrate({
      id: brand<string, "SpecificationId">(
        "018f3c8a-0000-7000-8000-000000000024",
      ) as Specification.Id,
      name: "Color",
      categoryId: brand<string, "CategoryId">(CATEGORY_ID),
      storeId: brand<string, "StoreId">("store-1"),
      type: SpecificationValueType.STRING,
      isRequired: false,
      isPrimary: true,
      isActive: true,
      specificationValues: [
        {
          id: brand<string, "SpecificationValueId">(
            "018f3c8a-0000-7000-8000-000000000025",
          ),
          value: "Red",
        },
      ],
    }),
  ];

  return {
    specificationRepository: {
      getList: jest.fn(async () => specifications),
      ...overrides.specificationRepository,
    },
  };
}

describe("getCategorySpecificationsUsecase.execute", () => {
  it("returns specifications for a category in the authenticated store", async () => {
    const deps = createDeps();

    const output = await getCategorySpecificationsUsecase.execute(
      { categoryId: CATEGORY_ID },
      storeAuthContext,
      deps,
    );

    expect(output).toHaveLength(1);
    expect(output[0]?.name).toBe("Color");
  });
});

describe("getCategorySpecificationsUsecase via runner", () => {
  const runner = buildUsecaseRunner();
  const requireStoreAuth = createRequireStoreAuthPolicy();

  it("lists specifications through validated input", async () => {
    const deps = createDeps();

    const output = await runner.runWithInput(
      buildRunWithInputRequest({
        usecase: getCategorySpecificationsUsecase,
        input: { categoryId: CATEGORY_ID },
        context: baseContext,
        deps,
        beforePolicies: [
          validateGetCategorySpecificationsInput,
          requireStoreAuth,
          requireSpecificationReadPermission,
        ] as const,
      }),
    );

    expect(output).toHaveLength(1);
  });
});
