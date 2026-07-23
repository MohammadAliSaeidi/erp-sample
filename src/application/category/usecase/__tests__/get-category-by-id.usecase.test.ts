import { brand } from "@/lib/brand";
import {
  requireCategoryReadDetailsPermission,
  validateGetCategoryByIdInput,
} from "@/src/application/category/policy/category.policies";
import {
  getCategoryByIdUsecase,
  type GetCategoryByIdUsecaseDeps,
} from "@/src/application/category/usecase/get-category-by-id.usecase";
import { NotFoundError } from "@/src/application/core/errors/application.error";
import { buildRunWithInputRequest } from "@/src/application/core/usecase/factories";
import { createRequireStoreAuthPolicy } from "@/src/application/core/usecase/policies/common-policies";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import type {
  BaseContext,
  StoreAuthContext,
} from "@/src/application/core/usecase/types/context.types";
import { Category } from "@/src/domain/category/aggregates/category.aggregate";
import type { CategoryRepositoryPort } from "@/src/domain/category/category-repository.port";
import { StoreId } from "@/src/domain/store/store-id";

const CATEGORY_ID = "018f3c8a-0000-7000-8000-000000000001";

const storeAuthContext: StoreAuthContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  storeId: "store-1",
  adminId: "admin-1",
  grantsAll: false,
  permissions: ["categories:read-details"],
};

const baseContext: BaseContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  metadata: {
    storeId: "store-1",
    adminId: "admin-1",
    grantsAll: false,
    permissions: ["categories:read-details"],
  },
};

function createDeps(
  overrides: Partial<GetCategoryByIdUsecaseDeps> = {},
): GetCategoryByIdUsecaseDeps {
  return {
    categoryRepository: {
      getById: jest.fn(async () => null),
      ...overrides.categoryRepository,
    },
  };
}

describe("getCategoryByIdUsecase.execute", () => {
  it("returns a category when it exists in the store", async () => {
    const category = Category.rehydrate({
      id: brand<string, "CategoryId">(CATEGORY_ID) as Category.Id,
      name: "Food",
      description: "Meals",
    });
    const deps = createDeps({
      categoryRepository: {
        getById: jest.fn(async () => category),
      },
    });

    const output = await getCategoryByIdUsecase.execute(
      { categoryId: CATEGORY_ID },
      storeAuthContext,
      deps,
    );

    expect(output).toEqual({
      id: CATEGORY_ID,
      name: "Food",
      description: "Meals",
    });
    expect(deps.categoryRepository.getById).toHaveBeenCalledWith(
      brand<string, "CategoryId">(CATEGORY_ID) as Category.Id,
      brand<string, "StoreId">("store-1") as StoreId,
    );
  });

  it("throws when the category is missing", async () => {
    const deps = createDeps();

    await expect(
      getCategoryByIdUsecase.execute(
        { categoryId: CATEGORY_ID },
        storeAuthContext,
        deps,
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("getCategoryByIdUsecase via runner", () => {
  const runner = buildUsecaseRunner();
  const requireStoreAuth = createRequireStoreAuthPolicy();

  it("loads a category through validated input", async () => {
    const category = Category.rehydrate({
      id: brand<string, "CategoryId">(CATEGORY_ID) as Category.Id,
      name: "Snacks",
      description: null,
    });
    const deps = createDeps({
      categoryRepository: {
        getById: jest.fn(async () => category),
      },
    });

    const output = await runner.runWithInput(
      buildRunWithInputRequest({
        usecase: getCategoryByIdUsecase,
        input: { categoryId: CATEGORY_ID },
        context: baseContext,
        deps,
        beforePolicies: [
          validateGetCategoryByIdInput,
          requireStoreAuth,
          requireCategoryReadDetailsPermission,
        ] as const,
      }),
    );

    expect(output.name).toBe("Snacks");
  });
});
