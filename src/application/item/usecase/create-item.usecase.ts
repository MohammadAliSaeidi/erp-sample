import { brand } from "@/lib/brand";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import { Item } from "@/src/domain/item/aggregates/item.aggregate";
import type { ItemRepositoryPort } from "@/src/domain/item/item-repository.port";
import { StoreId } from "@/src/domain/store/store-id";
import { CategoryId } from "@/src/domain/category/category-id";
import { SpecificationId } from "@/src/domain/specification/specification-id";
import { SpecificationValueId } from "@/src/domain/specification/specification-value-id";
import type { IItemQueryPort } from "../port/item.query.port";
import { ItemDTO } from "../dto/item.dto";

export type CreateItemInputDTO = {
  name: string;
  number: string;
  description?: string;
  price: number;
  categoryId?: string;
  specificationAssignments: ReadonlyArray<{
    specificationId: string;
    specificationValueId: string;
  }>;
};

export type CreateItemUsecaseDeps = {
  itemRepository: Pick<ItemRepositoryPort, "create">;
  itemQuery: Pick<IItemQueryPort, "getItemDTOById">;
};

export const createItemUsecase = defineUsecase<
  CreateItemInputDTO,
  ItemDTO,
  StoreAuthContext,
  CreateItemUsecaseDeps
>(async (input, context, deps) => {
  const storeId = brand<string, "StoreId">(context.storeId) as StoreId;

  const item = Item.createNew({
    name: input.name,
    number: input.number,
    description: input.description ?? null,
    price: input.price,
    categoryId: brand<string, CategoryId>(input.categoryId!) as CategoryId,
    specificationAssignments: input.specificationAssignments.map(
      (assignment) => ({
        specificationId: brand<string, SpecificationId>(
          assignment.specificationId,
        ) as SpecificationId,
        specificationValueId: brand<string, SpecificationValueId>(
          assignment.specificationValueId,
        ) as SpecificationValueId,
      }),
    ),
  });

  const createdItem = await deps.itemRepository.create(item, storeId);

  return {
    description: createdItem.description,
    name: createdItem.name,
    number: createdItem.number,
    price: createdItem.price,
    isDeleted: createdItem.isDeleted,
    id: createdItem.id,
    categoryId: createdItem.categoryId,
    categoryName: createdItem.ca,
    specificationAssignments: createdItem.specificationAssignments.map(
      (assignment) => ({
        specificationId: assignment.specificationId,
        specificationValueId: assignment.specificationValueId,
      }),
    ),
  };
});
