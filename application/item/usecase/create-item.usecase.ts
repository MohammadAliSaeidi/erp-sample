import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { Item, ItemSpecificationAssignment } from "@/domain/item/item.entity";
import { ItemDTO } from "@/interface/dto/item/item.dto";
import { createItemSchema } from "@/interface/schema/item/create-item.schema";
import { brand } from "@/lib/brand";
import { createItemDTOToEntityMapper } from "./mappers/create-item-dto-to-entity.mapper";
import { uuid7GeneratorAdapter } from "@/lib/id-generator/uuid-generator.adapter";
import { itemRepositoryAdapter } from "@/infrastructure/database/adapters/item/item-repository.adapter";
import { IItemRepositoryPort } from "@/domain/item/item-repository.port";
import { IItemQueryPort } from "../port/item.query.port";
import { itemQueryAdapter } from "@/infrastructure/database/adapters/item/item-query.adapter";
import { IdGeneratorPort } from "@/lib/id-generator/id-generator.port";
import { StoreId } from "@/domain/store/store-id";

export interface CreateItemUsecaseDeps {
  itemRepository: Pick<IItemRepositoryPort, "create">;
  itemQuery: Pick<IItemQueryPort, "getItemDTOById">;
  idGenerator: IdGeneratorPort;
}

export const buildCreateItemUsecase = (deps: CreateItemUsecaseDeps) =>
  authenticatedUsecaseFactory({
    key: "items.create",
    auth: "required",
    requiredPermissions: [PERMISSIONS.ITEMS.CREATE],
    inputSchema: createItemSchema,
    execute: async ({ input: item, authContext: { storeId } }) => {
      const itemUUID = deps.idGenerator.generate();
      const brandedStoreId: StoreId = brand(storeId);

      const mappedItem: Item = createItemDTOToEntityMapper.map({
        ...item,
        id: brand(itemUUID),
        categoryId: brand(item.categoryId),
        description: item.description ?? undefined,
        name: item.name,
        number: item.number,
        price: item.price,
        specificationAssignments: item.specificationAssignments.map(
          (assignment): ItemSpecificationAssignment => ({
            specificationId: brand(assignment.specificationId),
            specificationValueId: brand(assignment.specificationValueId),
          }),
        ),
      });

      const createdItem = await deps.itemRepository.create(
        mappedItem,
        brand(storeId),
      );

      const itemDTO: ItemDTO | null = await deps.itemQuery.getItemDTOById(
        createdItem.id,
        brandedStoreId,
      );

      return itemDTO;
    },
  });

export const createItemUsecase = buildCreateItemUsecase({
  itemQuery: itemQueryAdapter,
  itemRepository: itemRepositoryAdapter,
  idGenerator: uuid7GeneratorAdapter,
});
