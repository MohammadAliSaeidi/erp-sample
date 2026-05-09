import { ItemId } from "@/domain/item/item-id";
import { StoreId } from "@/domain/store/store-id";
import { ItemDTO } from "@/interface/dto/item/item.dto";
import { ItemListQueryInput } from "../schema/item-list-query.schema";

export interface IItemQueryPort {
  getItemDTOById(itemId: ItemId, storeId: StoreId): Promise<ItemDTO | null>;
  getItemDTOList(
    storeId: StoreId,
    filterParmas: ItemListQueryInput,
  ): Promise<ItemDTO[]>;
}
