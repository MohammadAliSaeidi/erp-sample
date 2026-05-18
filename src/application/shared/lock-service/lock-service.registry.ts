import { LockKey } from "@/src/application/shared/lock-service/lock-service.types";
import { ItemId } from "@/src/domain/item/item-id";
import { StoreId } from "@/src/domain/store/store-id";
import { brand } from "@/lib/brand";

export const LockKeys = {
  item(storeId: StoreId, itemId: ItemId): LockKey {
    return brand(`store:${storeId}:item:${itemId}`);
  },
};
