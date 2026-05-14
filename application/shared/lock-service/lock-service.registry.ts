import { LockKey } from "@/application/shared/lock-service/lock-service.types";
import { brand } from "@/lib/brand";

export const LockKeys = {
  item(storeId: string, itemId: string): LockKey {
    return brand(`store:${storeId}:item:${itemId}`);
  },
};
