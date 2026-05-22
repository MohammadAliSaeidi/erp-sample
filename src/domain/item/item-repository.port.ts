import { ItemId } from "./item-id";
import { Item } from "./item.entity";
import { StoreId } from "../store/store-id";

export interface ItemRepositoryPort {
  getList: (storeId: StoreId) => Promise<Item[]>;
  getById: (itemId: ItemId, storeId: StoreId) => Promise<Item | null>;
  create: (item: Item, storeId: StoreId) => Promise<Item>;
  update: (item: Item, storeId: StoreId) => Promise<Item>;
}
