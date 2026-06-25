import { brand } from "@/lib/brand";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import { ItemDTO } from "@/src/application/item/dto/item.dto";
import { StoreId } from "@/src/domain/store/store-id";
import type { IItemQueryPort } from "../port/item.query.port";
import type { ItemListQueryInput } from "../schema/item-list-query.schema";

export type GetItemsListUsecaseDeps = {
  itemsQueryPort: Pick<IItemQueryPort, "getItemDTOList">;
};

export const getItemsListUsecase = defineUsecase<
  ItemListQueryInput,
  ItemDTO[],
  StoreAuthContext,
  GetItemsListUsecaseDeps
>(async (input, context, deps) =>
  deps.itemsQueryPort.getItemDTOList(
    brand<string, "StoreId">(context.storeId) as StoreId,
    input,
  ),
);
