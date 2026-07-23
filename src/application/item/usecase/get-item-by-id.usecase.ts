import { brand } from "@/lib/brand";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import { NotFoundError } from "@/src/application/core/errors/application.error";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import { ItemDTO } from "@/src/application/item/dto/item.dto";
import type { IItemQueryPort } from "@/src/application/item/port/item.query.port";
import { Item } from "@/src/domain/item/aggregates/item.aggregate";
import { StoreId } from "@/src/domain/store/store-id";

export type GetItemByIdInputDTO = {
  itemId: string;
};

export type GetItemByIdUsecaseDeps = {
  itemQuery: Pick<IItemQueryPort, "getItemDTOById">;
};

export const getItemByIdUsecase = defineUsecase<
  GetItemByIdInputDTO,
  ItemDTO,
  StoreAuthContext,
  GetItemByIdUsecaseDeps
>(async (input, context, deps) => {
  const item = await deps.itemQuery.getItemDTOById(
    brand<string, "ItemId">(input.itemId) as Item.Id,
    brand<string, StoreId>(context.storeId) as StoreId,
  );

  if (!item) {
    throw new NotFoundError(`Item ${input.itemId} was not found`);
  }

  return item;
});
