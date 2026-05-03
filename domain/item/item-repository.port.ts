import { StoreId } from "@/features/shared/domain/ids";
import { ItemId } from "./item-id";
import { Item } from "./item.entity";

export interface IItemRepositoryPort {
  getList: (storeId: StoreId) => Promise<Item[]>;
  getById: (itemId: ItemId, storeId: StoreId) => Promise<Item | null>;
  create: (item: Item, storeId: StoreId) => Promise<Item>;
  update: (item: Item, storeId: StoreId) => Promise<Item>;
}
