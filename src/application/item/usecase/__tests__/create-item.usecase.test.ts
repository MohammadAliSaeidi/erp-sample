import { brand } from "@/lib/brand";
import {
  requireItemCreatePermission,
  validateCreateItemInput,
} from "@/src/application/item/policy/item.policies";
import {
  createItemUsecase,
  type CreateItemUsecaseDeps,
} from "@/src/application/item/usecase/create-item.usecase";
import { buildRunWithInputRequest } from "@/src/application/core/usecase/factories";
import { createRequireStoreAuthPolicy } from "@/src/application/core/usecase/policies/common-policies";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import type {
  BaseContext,
  StoreAuthContext,
} from "@/src/application/core/usecase/types/context.types";
import { Item } from "@/src/domain/item/aggregates/item.aggregate";
import type { ItemRepositoryPort } from "@/src/domain/item/item-repository.port";
import type { IItemQueryPort } from "@/src/application/item/port/item.query.port";
import { StoreId } from "@/src/domain/store/store-id";

const CATEGORY_ID = "018f3c8a-0000-7000-8000-000000000007";
const SPEC_ID = "018f3c8a-0000-7000-8000-000000000008";
const SPEC_VALUE_ID = "018f3c8a-0000-7000-8000-000000000009";
const ITEM_ID = "018f3c8a-0000-7000-8000-000000000010";

const storeAuthContext: StoreAuthContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  storeId: "store-1",
  adminId: "admin-1",
  grantsAll: false,
  permissions: ["items:create"],
};

const baseContext: BaseContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  metadata: {
    storeId: "store-1",
    adminId: "admin-1",
    grantsAll: false,
    permissions: ["items:create"],
  },
};

const validInput = {
  name: "Latte",
  number: "2001",
  price: 18,
  categoryId: CATEGORY_ID,
  specificationAssignments: [
    {
      specificationId: SPEC_ID,
      specificationValueId: SPEC_VALUE_ID,
    },
  ],
};

function createDeps(
  overrides: Partial<CreateItemUsecaseDeps> = {},
): CreateItemUsecaseDeps {
  const createdItem = Item.rehydrate({
    id: brand<string, "ItemId">(ITEM_ID) as Item.Id,
    name: "Latte",
    number: "2001",
    description: null,
    price: 18,
    categoryId: brand<string, "CategoryId">(CATEGORY_ID),
    specificationAssignments: [],
    isDeleted: true,
  });

  return {
    itemRepository: {
      create: jest.fn(async () => createdItem),
      ...overrides.itemRepository,
    },
    itemQuery: {
      getItemDTOById: jest.fn(async () => ({
        id: ITEM_ID,
        name: "Latte",
        number: "2001",
        price: 18,
        categoryId: CATEGORY_ID,
        isDeleted: true,
        specificationAssignments: [],
      })),
      ...overrides.itemQuery,
    },
  };
}

describe("createItemUsecase.execute", () => {
  it("creates an item and returns the query DTO", async () => {
    const deps = createDeps();

    const output = await createItemUsecase.execute(
      validInput,
      storeAuthContext,
      deps,
    );

    expect(output).toEqual(
      expect.objectContaining({
        id: ITEM_ID,
        name: "Latte",
        number: "2001",
      }),
    );
    expect(deps.itemRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Latte", number: "2001" }),
      brand<string, "StoreId">("store-1") as StoreId,
    );
    expect(deps.itemQuery.getItemDTOById).toHaveBeenCalled();
  });
});

describe("createItemUsecase via runner", () => {
  const runner = buildUsecaseRunner();
  const requireStoreAuth = createRequireStoreAuthPolicy();

  it("creates an item through validated input", async () => {
    const deps = createDeps();

    const output = await runner.runWithInput(
      buildRunWithInputRequest({
        usecase: createItemUsecase,
        input: validInput,
        context: baseContext,
        deps,
        beforePolicies: [
          validateCreateItemInput,
          requireStoreAuth,
          requireItemCreatePermission,
        ] as const,
      }),
    );

    expect(output?.name).toBe("Latte");
  });
});
