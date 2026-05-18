import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { brand } from "@/lib/brand";
import { IItemQueryPort } from "../port/item.query.port";
import { itemQueryAdapter } from "@/src/infrastructure/database/adapters/item/item-query.adapter";
import { itemListQueryInputSchema } from "../schema/item-list-query.schema";

export interface GetItemsListUsecaseDeps {
  itemsQueryPort: Pick<IItemQueryPort, "getItemDTOList">;
}

export const buildGetItemsListUsecase = (deps: GetItemsListUsecaseDeps) =>
  authenticatedUsecaseFactory({
    key: "items.list",
    auth: "required",
    requiredPermissions: [PERMISSIONS.ITEMS.READ],
    inputSchema: itemListQueryInputSchema,
    execute: async ({ input, authContext: { storeId } }) => {
      return deps.itemsQueryPort.getItemDTOList(brand(storeId), input);
    },
  });

export const getItemsListUsecase = buildGetItemsListUsecase({
  itemsQueryPort: itemQueryAdapter,
});
