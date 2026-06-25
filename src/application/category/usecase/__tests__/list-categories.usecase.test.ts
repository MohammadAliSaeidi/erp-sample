import { brand } from "@/lib/brand";
import {
  requireCategoryReadPermissionWithoutInput,
} from "@/src/application/category/policy/category.policies";
import {
  listCategoriesUsecase,
  type ListCategoriesUsecaseDeps,
} from "@/src/application/category/usecase/list-categories.usecase";
import { buildRunWithoutInputRequest } from "@/src/application/core/usecase/factories";
import { createRequireStoreAuthPolicyWithoutInput } from "@/src/application/core/usecase/policies/common-policies";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import type {
  BaseContext,
  StoreAuthContext,
} from "@/src/application/core/usecase/types/context.types";
import { Category } from "@/src/domain/category/aggregates/category.aggregate";
import type { ICategoryRepositoryPort } from "@/src/domain/category/category-repository.port";
import { StoreId } from "@/src/domain/store/store-id";

const storeAuthContext: StoreAuthContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  storeId: "store-1",
  adminId: "admin-1",
  grantsAll: false,
  permissions: ["categories:read"],
};

const baseContext: BaseContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  metadata: {
    storeId: "store-1",
    adminId: "admin-1",
    grantsAll: false,
    permissions: ["categories:read"],
  },
};

function createDeps(
  overrides: Partial<ListCategoriesUsecaseDeps> = {},
): ListCategoriesUsecaseDeps {
  return {
    categoryRepository: {
      getList: jest.fn(async () => []),
      ...overrides.categoryRepository,
    },
  };
}

describe("listCategoriesUsecase.execute", () => {
  it("returns categories for the authenticated store", async () => {
    const categories = [
      Category.rehydrate({
        id: brand<string, "CategoryId">("cat-1") as Category.Id,
        name: "Food",
        description: null,
      }),
    ];
    const deps = createDeps({
      categoryRepository: {
        getList: jest.fn(async () => categories),
      },
    });

    const output = await listCategoriesUsecase.execute(storeAuthContext, deps);

    expect(output).toEqual([
      { id: "cat-1", name: "Food", description: null },
    ]);
    expect(deps.categoryRepository.getList).toHaveBeenCalledWith(
      brand<string, "StoreId">("store-1") as StoreId,
    );
  });
});

describe("listCategoriesUsecase via runner", () => {
  const runner = buildUsecaseRunner();
  const requireStoreAuth = createRequireStoreAuthPolicyWithoutInput();

  it("lists categories after auth policies pass", async () => {
    const deps = createDeps({
      categoryRepository: {
        getList: jest.fn(async () => [
          Category.rehydrate({
            id: brand<string, "CategoryId">("cat-2") as Category.Id,
            name: "Drinks",
            description: "Cold drinks",
          }),
        ]),
      },
    });

    const output = await runner.runWithoutInput(
      buildRunWithoutInputRequest({
        usecase: listCategoriesUsecase,
        context: baseContext,
        deps,
        beforePolicies: [
          requireStoreAuth,
          requireCategoryReadPermissionWithoutInput,
        ] as const,
      }),
    );

    expect(output).toEqual([
      { id: "cat-2", name: "Drinks", description: "Cold drinks" },
    ]);
  });
});
