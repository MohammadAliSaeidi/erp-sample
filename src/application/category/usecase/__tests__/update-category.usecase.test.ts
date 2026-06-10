import { brand } from "@/lib/brand";
import {
  requireCategoryUpdatePermission,
  validateUpdateCategoryInput,
} from "@/src/application/category/policy/category.policies";
import {
  updateCategoryUsecase,
  type UpdateCategoryUsecaseDeps,
} from "@/src/application/category/usecase/update-category.usecase";
import { NotFoundError } from "@/src/application/core/errors/application.error";
import { buildRunWithInputRequest } from "@/src/application/core/usecase/factories";
import { createRequireStoreAuthPolicy } from "@/src/application/core/usecase/policies/common-policies";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import type {
  BaseContext,
  StoreAuthContext,
} from "@/src/application/core/usecase/types/context.types";
import { Category } from "@/src/domain/category/aggregates/category.aggregate";
import { CategoryNotFoundForStoreError } from "@/src/domain/category/errors/category-not-found-for-store.error";
import { StoreId } from "@/src/domain/store/store-id";

const CATEGORY_ID = "018f3c8a-0000-7000-8000-000000000002";

const storeAuthContext: StoreAuthContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  storeId: "store-1",
  adminId: "admin-1",
  grantsAll: false,
  permissions: ["categories:update"],
};

const baseContext: BaseContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  metadata: {
    storeId: "store-1",
    adminId: "admin-1",
    grantsAll: false,
    permissions: ["categories:update"],
  },
};

function createDeps(
  overrides: Partial<UpdateCategoryUsecaseDeps> = {},
): UpdateCategoryUsecaseDeps {
  return {
    categoryRepository: {
      update: jest.fn(async (category) => category),
      ...overrides.categoryRepository,
    },
  };
}

describe("updateCategoryUsecase.execute", () => {
  it("updates a category for the authenticated store", async () => {
    const updated = Category.rehydrate({
      id: brand<string, "CategoryId">(CATEGORY_ID) as Category.Id,
      name: "Updated Food",
      description: "New description",
    });
    const deps = createDeps({
      categoryRepository: {
        update: jest.fn(async () => updated),
      },
    });

    const output = await updateCategoryUsecase.execute(
      {
        id: CATEGORY_ID,
        name: "Updated Food",
        description: "New description",
      },
      storeAuthContext,
      deps,
    );

    expect(output).toEqual({
      id: CATEGORY_ID,
      name: "Updated Food",
      description: "New description",
    });
    expect(deps.categoryRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Updated Food" }),
      brand<string, "StoreId">("store-1") as StoreId,
    );
  });

  it("maps missing category domain errors to not found", async () => {
    const deps = createDeps({
      categoryRepository: {
        update: jest.fn(async () => {
          throw new CategoryNotFoundForStoreError(CATEGORY_ID, "store-1");
        }),
      },
    });

    await expect(
      updateCategoryUsecase.execute(
        { id: CATEGORY_ID, name: "Food" },
        storeAuthContext,
        deps,
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("updateCategoryUsecase via runner", () => {
  const runner = buildUsecaseRunner();
  const requireStoreAuth = createRequireStoreAuthPolicy();

  it("updates through validated input", async () => {
    const updated = Category.rehydrate({
      id: brand<string, "CategoryId">(CATEGORY_ID) as Category.Id,
      name: "Renamed",
      description: null,
    });
    const deps = createDeps({
      categoryRepository: {
        update: jest.fn(async () => updated),
      },
    });

    const output = await runner.runWithInput(
      buildRunWithInputRequest({
        usecase: updateCategoryUsecase,
        input: { id: CATEGORY_ID, name: "Renamed" },
        context: baseContext,
        deps,
        beforePolicies: [
          validateUpdateCategoryInput,
          requireStoreAuth,
          requireCategoryUpdatePermission,
        ] as const,
      }),
    );

    expect(output.name).toBe("Renamed");
  });
});
