import { brand } from "@/lib/brand";
import {
  requireItemReadPermission,
  validateGetItemsListInput,
} from "@/src/application/item/policy/item.policies";
import {
  getItemsListUsecase,
  type GetItemsListUsecaseDeps,
} from "@/src/application/item/usecase/get-items-list.usecase";
import { buildRunWithInputRequest } from "@/src/application/core/usecase/factories";
import { createRequireStoreAuthPolicy } from "@/src/application/core/usecase/policies/common-policies";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import type {
  BaseContext,
  StoreAuthContext,
} from "@/src/application/core/usecase/types/context.types";
import { ItemDTO } from "@/src/application/item/dto/item.dto";
import type { IItemQueryPort } from "@/src/application/item/port/item.query.port";
import { StoreId } from "@/src/domain/store/store-id";

const storeAuthContext: StoreAuthContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  storeId: "store-1",
  adminId: "admin-1",
  grantsAll: false,
  permissions: ["items:read"],
};

const baseContext: BaseContext = {
  requestId: "req-1",
  timestamp: new Date("2026-06-10T12:00:00.000Z"),
  metadata: {
    storeId: "store-1",
    adminId: "admin-1",
    grantsAll: false,
    permissions: ["items:read"],
  },
};

const items: ItemDTO[] = [
  {
    id: "018f3c8a-0000-7000-8000-000000000014",
    name: "Latte",
    number: "2001",
    price: 18,
    categoryId: "018f3c8a-0000-7000-8000-000000000015",
    isDeleted: false,
    specificationAssignments: [],
  },
];

function createDeps(
  overrides: Partial<GetItemsListUsecaseDeps> = {},
): GetItemsListUsecaseDeps {
  return {
    itemsQueryPort: {
      getItemDTOList: jest.fn(async () => items),
      ...overrides.itemsQueryPort,
    },
  };
}

describe("getItemsListUsecase.execute", () => {
  it("returns items for the authenticated store", async () => {
    const deps = createDeps();

    const output = await getItemsListUsecase.execute(
      {},
      storeAuthContext,
      deps,
    );

    expect(output).toEqual(items);
    expect(deps.itemsQueryPort.getItemDTOList).toHaveBeenCalledWith(
      brand<string, "StoreId">("store-1") as StoreId,
      {},
    );
  });
});

describe("getItemsListUsecase via runner", () => {
  const runner = buildUsecaseRunner();
  const requireStoreAuth = createRequireStoreAuthPolicy();

  it("lists items through validated input", async () => {
    const deps = createDeps();

    const output = await runner.runWithInput(
      buildRunWithInputRequest({
        usecase: getItemsListUsecase,
        input: {},
        context: baseContext,
        deps,
        beforePolicies: [
          validateGetItemsListInput,
          requireStoreAuth,
          requireItemReadPermission,
        ] as const,
      }),
    );

    expect(output).toHaveLength(1);
    expect(output[0]?.name).toBe("Latte");
  });
});
