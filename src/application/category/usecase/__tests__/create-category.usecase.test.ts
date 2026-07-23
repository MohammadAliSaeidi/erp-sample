import { brand } from "@/lib/brand";
import {
  requireCategoryCreatePermission,
  validateCreateCategoryInput,
} from "@/src/application/category/policy/category.policies";
import {
  createCategoryUsecase,
  type CreateCategoryUsecaseDeps,
} from "@/src/application/category/usecase/create-category.usecase";
import { ForbiddenError } from "@/src/application/core/errors/application.error";
import { InputValidationError } from "@/src/application/core/errors/input-validation.error";
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

const NOW = new Date("2026-06-10T12:00:00.000Z");

const baseContext: BaseContext = {
  requestId: "req-1",
  timestamp: NOW,
  metadata: {
    storeId: "store-1",
    adminId: "admin-1",
    grantsAll: false,
    permissions: ["categories:create"],
  },
};

const storeAuthContext: StoreAuthContext = {
  requestId: "req-1",
  timestamp: NOW,
  storeId: "store-1",
  adminId: "admin-1",
  grantsAll: false,
  permissions: ["categories:create"],
};

function createDeps(
  overrides: Partial<CreateCategoryUsecaseDeps> = {},
): CreateCategoryUsecaseDeps {
  const categoryRepository: Pick<CategoryRepositoryPort, "create"> = {
    create: jest.fn(async (category) => category),
    ...overrides.categoryRepository,
  };

  return { categoryRepository };
}

describe("createCategoryUsecase.execute", () => {
  it("creates a category for the authenticated store", async () => {
    const deps = createDeps();

    const output = await createCategoryUsecase.execute(
      { name: "Beverages", description: "Drinks" },
      storeAuthContext,
      deps,
    );

    expect(output).toEqual({
      id: expect.any(String),
      name: "Beverages",
      description: "Drinks",
    });
    expect(deps.categoryRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Beverages", description: "Drinks" }),
      brand<string, "StoreId">("store-1") as StoreId,
    );
  });
});

describe("createCategoryUsecase via runner", () => {
  const runner = buildUsecaseRunner();
  const requireStoreAuth = createRequireStoreAuthPolicy();

  it("rejects invalid input before execution", async () => {
    const deps = createDeps();

    await expect(
      runner.runWithInput(
        buildRunWithInputRequest({
          usecase: createCategoryUsecase,
          input: { name: "" },
          context: baseContext,
          deps,
          beforePolicies: [
            validateCreateCategoryInput,
            requireStoreAuth,
            requireCategoryCreatePermission,
          ] as const,
        }),
      ),
    ).rejects.toBeInstanceOf(InputValidationError);
  });

  it("rejects callers without create permission", async () => {
    const deps = createDeps();

    await expect(
      runner.runWithInput(
        buildRunWithInputRequest({
          usecase: createCategoryUsecase,
          input: { name: "Food" },
          context: {
            ...baseContext,
            metadata: {
              ...baseContext.metadata,
              permissions: ["categories:read"],
            },
          },
          deps,
          beforePolicies: [
            validateCreateCategoryInput,
            requireStoreAuth,
            requireCategoryCreatePermission,
          ] as const,
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("persists a validated category", async () => {
    const persisted = Category.rehydrate({
      id: brand<string, "CategoryId">("cat-1") as Category.Id,
      name: "Desserts",
      description: null,
    });
    const deps = createDeps({
      categoryRepository: {
        create: jest.fn(async () => persisted),
      },
    });

    const output = await runner.runWithInput(
      buildRunWithInputRequest({
        usecase: createCategoryUsecase,
        input: { name: "Desserts" },
        context: baseContext,
        deps,
        beforePolicies: [
          validateCreateCategoryInput,
          requireStoreAuth,
          requireCategoryCreatePermission,
        ] as const,
      }),
    );

    expect(output).toEqual({
      id: "cat-1",
      name: "Desserts",
      description: null,
    });
  });
});
