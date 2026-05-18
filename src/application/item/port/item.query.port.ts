import { ItemId } from "@/src/domain/item/item-id";
import { StoreId } from "@/src/domain/store/store-id";
import { ItemListQueryInput } from "../schema/item-list-query.schema";
import { ItemDTO } from "@/src/application/item/dto/item.dto";

// we return DTO instead of domain model, so we must put this port in the application layer
export interface IItemQueryPort {
  getItemDTOById(itemId: ItemId, storeId: StoreId): Promise<ItemDTO | null>;
  getItemDTOList(
    storeId: StoreId,
    filterParams: ItemListQueryInput,
  ): Promise<ItemDTO[]>;
}
