import type { CreateItemUsecaseDeps } from "@/src/application/item/usecase/create-item.usecase";
import { itemQueryAdapter } from "@/src/infrastructure/database/adapters/item/item-query.adapter";
import { itemRepositoryAdapter } from "@/src/infrastructure/database/adapters/item/item-repository.adapter";

export const createItemDeps: CreateItemUsecaseDeps = {
  itemRepository: itemRepositoryAdapter,
  itemQuery: itemQueryAdapter,
};
