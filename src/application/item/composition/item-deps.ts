import type { CreateItemUsecaseDeps } from "@/src/application/item/usecase/create-item.usecase";
import type { EditItemUsecaseDeps } from "@/src/application/item/usecase/edit-item.usecase";
import type { GetItemsListUsecaseDeps } from "@/src/application/item/usecase/get-items-list.usecase";
import type { GetItemByIdUsecaseDeps } from "@/src/application/item/usecase/get-item-by-id.usecase";
import { itemQueryAdapter } from "@/src/infrastructure/database/adapters/item/item-query.adapter";
import { itemRepositoryAdapter } from "@/src/infrastructure/database/adapters/item/item-repository.adapter";

export const itemDeps = {
  create: {
    itemRepository: itemRepositoryAdapter,
    itemQuery: itemQueryAdapter,
  } satisfies CreateItemUsecaseDeps,
  edit: {
    itemRepository: itemRepositoryAdapter,
    itemQuery: itemQueryAdapter,
  } satisfies EditItemUsecaseDeps,
  list: {
    itemsQueryPort: itemQueryAdapter,
  } satisfies GetItemsListUsecaseDeps,
  getById: {
    itemQuery: itemQueryAdapter,
  } satisfies GetItemByIdUsecaseDeps,
};
