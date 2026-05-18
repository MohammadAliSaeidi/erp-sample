import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { Item } from "@/src/domain/item/item.entity";
import { ItemDTO } from "@/src/application/item/dto/item.dto";
import { brand } from "@/lib/brand";
import { createItemDTOToEntityMapper } from "./mappers/create-item-dto-to-entity.mapper";
import { itemRepositoryAdapter } from "@/src/infrastructure/database/adapters/item/item-repository.adapter";
import { IItemRepositoryPort } from "@/src/domain/item/item-repository.port";
import { IItemQueryPort } from "../port/item.query.port";
import { itemQueryAdapter } from "@/src/infrastructure/database/adapters/item/item-query.adapter";
import { StoreId } from "@/src/domain/store/store-id";
import { editItemSchema } from "@/src/application/item/schema/edit.item.schema";
import { ItemId } from "@/src/domain/item/item-id";
import { UseCaseNotFoundError } from "@/src/application/shared/errors/use-case-errors";

export interface EditItemUsecaseDeps {
  itemRepository: Pick<IItemRepositoryPort, "update">;
  itemQuery: Pick<IItemQueryPort, "getItemDTOById">;
}

export const buildEditItemUsecase = (deps: EditItemUsecaseDeps) =>
  authenticatedUsecaseFactory({
    key: "items.edit",
    auth: "required",
    requiredPermissions: [PERMISSIONS.ITEMS.UPDATE],
    inputSchema: editItemSchema,
    execute: async ({ input: item, authContext: { storeId } }) => {
      const brandedItemId: ItemId = brand(item.id);
      const brandedStoreId: StoreId = brand(storeId);

      const existingItem: ItemDTO | null = await deps.itemQuery.getItemDTOById(
        brandedItemId,
        brandedStoreId,
      );

      if (!existingItem) throw new UseCaseNotFoundError(``);

      const mappedItem: Item = createItemDTOToEntityMapper.map({
        id: brandedItemId,
        categoryId: item.categoryId ?? brand(existingItem.categoryId),
        description: item.description ?? existingItem.description,
        name: item.name ?? existingItem.name,
        number: item.number ?? existingItem.number,
        price: item.price ?? existingItem.price,
        specificationAssignments:
          item.specificationAssignments ??
          existingItem.specificationAssignments.map((assignment) => ({
            specificationId: assignment.specification.id,
            specificationValueId: assignment.specificationValue.id,
          })),
      });

      const updatedItem = await deps.itemRepository.update(
        mappedItem,
        brand(storeId),
      );

      const updatedItemDTO: ItemDTO | null =
        await deps.itemQuery.getItemDTOById(updatedItem.id, brandedStoreId);

      return updatedItemDTO;
    },
  });

export const editItemUsecase = buildEditItemUsecase({
  itemQuery: itemQueryAdapter,
  itemRepository: itemRepositoryAdapter,
});
