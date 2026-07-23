import { ItemId } from "./item-id";
import { StoreId } from "../store/store-id";
import { Item } from "./aggregates/item.aggregate";

export interface ItemRepositoryPort {
  getList: (storeId: StoreId) => Promise<Item.Aggregate[]>;
  getById: (itemId: ItemId, storeId: StoreId) => Promise<Item.Aggregate | null>;
  create: (item: Item.Aggregate, storeId: StoreId) => Promise<Item.Aggregate>;
  update: (item: Item.Aggregate, storeId: StoreId) => Promise<Item.Aggregate>;
}
