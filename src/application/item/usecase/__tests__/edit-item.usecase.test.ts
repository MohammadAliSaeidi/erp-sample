import { brand } from "@/lib/brand";
import {
  requireItemUpdatePermission,
  validateEditItemInput,
} from "@/src/application/item/policy/item.policies";
import {
  editItemUsecase,
  type EditItemUsecaseDeps,
} from "@/src/application/item/usecase/edit-item.usecase";
import { NotFoundError } from "@/src/application/core/errors/application.error";
import { buildRunWithInputRequest } from "@/src/application/core/usecase/factories";
import { createRequireStoreAuthPolicy } from "@/src/application/core/usecase/policies/common-policies";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import type {
  BaseContext,
  StoreAuthContext,
} from "@/src/application/core/usecase/types/context.types";
import { ItemDTO } from "@/src/application/item/dto/item.dto";
import { Item } from "@/src/domain/item/aggregates/item.aggregate";
import type { ItemRepositoryPort } from "@/src/domain/item/item-repository.port";
import type { IItemQueryPort } from "@/src/application/item/port/item.query.port";
import { StoreId } from "@/src/domain/store/store-id";

const ITEM_ID = "018f3c8a-0000-7000-8000-000000000012";
const CATEGORY_ID = "018f3c8a-0000-7000-8000-000000000013";

const storeAuthContext: StoreAuthContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  storeId: "store-1",
  adminId: "admin-1",
  grantsAll: false,
  permissions: ["items:update"],
};

const baseContext: BaseContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  metadata: {
    storeId: "store-1",
    adminId: "admin-1",
    grantsAll: false,
    permissions: ["items:update"],
  },
};

const existingItemDto: ItemDTO = {
  id: ITEM_ID,
  name: "Latte",
  number: "2001",
  price: 18,
  categoryId: CATEGORY_ID,
  isDeleted: false,
  specificationAssignments: [],
};

const updatedItemDto: ItemDTO = {
  ...existingItemDto,
  name: "Iced Latte",
  price: 20,
};

function createDeps(
  overrides: Partial<EditItemUsecaseDeps> = {},
): EditItemUsecaseDeps {
  const updatedAggregate = Item.rehydrate({
    id: brand<string, "ItemId">(ITEM_ID) as Item.Id,
    name: "Iced Latte",
    number: "2001",
    description: null,
    price: 20,
    categoryId: brand<string, "CategoryId">(CATEGORY_ID),
    specificationAssignments: [],
    isDeleted: false,
  });

  return {
    itemQuery: {
      getItemDTOById: jest
        .fn()
        .mockResolvedValueOnce(existingItemDto)
        .mockResolvedValueOnce(updatedItemDto),
      ...overrides.itemQuery,
    },
    itemRepository: {
      update: jest.fn(async () => updatedAggregate),
      ...overrides.itemRepository,
    },
  };
}

describe("editItemUsecase.execute", () => {
  it("merges partial input with the existing item and persists changes", async () => {
    const deps = createDeps();

    const output = await editItemUsecase.execute(
      { id: ITEM_ID, name: "Iced Latte", price: 20 },
      storeAuthContext,
      deps,
    );

    expect(output).toEqual(updatedItemDto);
    expect(deps.itemRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Iced Latte", price: 20 }),
      brand<string, "StoreId">("store-1") as StoreId,
    );
  });

  it("throws when the item does not exist", async () => {
    const deps = createDeps({
      itemQuery: {
        getItemDTOById: jest.fn(async () => null),
      },
    });

    await expect(
      editItemUsecase.execute(
        { id: ITEM_ID, name: "Iced Latte" },
        storeAuthContext,
        deps,
      ),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("editItemUsecase via runner", () => {
  const runner = buildUsecaseRunner();
  const requireStoreAuth = createRequireStoreAuthPolicy();

  it("updates through validated input", async () => {
    const deps = createDeps();

    const output = await runner.runWithInput(
      buildRunWithInputRequest({
        usecase: editItemUsecase,
        input: { id: ITEM_ID, name: "Iced Latte", price: 20 },
        context: baseContext,
        deps,
        beforePolicies: [
          validateEditItemInput,
          requireStoreAuth,
          requireItemUpdatePermission,
        ] as const,
      }),
    );

    expect(output?.name).toBe("Iced Latte");
  });
});
