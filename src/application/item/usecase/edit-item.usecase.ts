import { brand } from "@/lib/brand";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import { NotFoundError } from "@/src/application/core/errors/application.error";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import { ItemDTO } from "@/src/application/item/dto/item.dto";
import { Item } from "@/src/domain/item/aggregates/item.aggregate";
import type { ItemRepositoryPort } from "@/src/domain/item/item-repository.port";
import { CategoryId } from "@/src/domain/category/category-id";
import { SpecificationId } from "@/src/domain/specification/specification-id";
import { SpecificationValueId } from "@/src/domain/specification/specification-value-id";
import type { IItemQueryPort } from "../port/item.query.port";
import { StoreId } from "@/src/domain/store/store-id";

export type EditItemInputDTO = {
  id: string;
  name?: string;
  number?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  specificationAssignments?: ReadonlyArray<{
    specificationId: string;
    specificationValueId: string;
  }>;
};

export type EditItemUsecaseDeps = {
  itemRepository: Pick<ItemRepositoryPort, "update">;
  itemQuery: Pick<IItemQueryPort, "getItemDTOById">;
};

export const editItemUsecase = defineUsecase<
  EditItemInputDTO,
  ItemDTO | null,
  StoreAuthContext,
  EditItemUsecaseDeps
>(async (input, context, deps) => {
  const storeId = brand<string, "StoreId">(context.storeId) as StoreId;
  const itemId = brand<string, "ItemId">(input.id) as Item.Id;

  const existingItem = await deps.itemQuery.getItemDTOById(itemId, storeId);

  if (!existingItem) {
    throw new NotFoundError(`Item ${input.id} was not found`);
  }

  const specificationAssignments = (
    input.specificationAssignments ??
    existingItem.specificationAssignments.map((assignment) => ({
      specificationId: assignment.specification.id,
      specificationValueId: assignment.specificationValue.id,
    }))
  ).map((assignment) => ({
    specificationId: brand<string, SpecificationId>(
      assignment.specificationId,
    ) as SpecificationId,
    specificationValueId: brand<string, SpecificationValueId>(
      assignment.specificationValueId,
    ) as SpecificationValueId,
  }));

  const item = Item.update({
    id: itemId,
    name: input.name ?? existingItem.name,
    number: input.number ?? existingItem.number,
    description: input.description ?? existingItem.description ?? null,
    price: input.price ?? existingItem.price,
    categoryId: brand<string, CategoryId>(
      input.categoryId ?? existingItem.categoryId!,
    ) as CategoryId,
    specificationAssignments,
    isDeleted: existingItem.isDeleted,
  });

  const updatedItem = await deps.itemRepository.update(item, storeId);

  return deps.itemQuery.getItemDTOById(updatedItem.id, storeId);
});
