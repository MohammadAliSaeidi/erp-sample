import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { SpecificationDTO } from "../../../interface/dto/specification/specification.dto";
import { specificationRepositoryAdapter } from "../../../infrastructure/database/adapters/specification/specification-repository.adapter";
import { BadRequestError } from "@/features/shared/errors/bad-request.error";
import { Item } from "@/domain/item/item.entity";
import { ItemDTO } from "@/interface/dto/item/item.dto";
import { createItemSchema } from "@/interface/schema/item/create-item.schema";
import { CreateItemInputDTO } from "@/interface/dto/item/create-item-input.dto";
import { StoreId } from "@/domain/store/store-id";
import { brand } from "@/lib/brand";
import { createItemDTOToEntityMapper } from "./mappers/create-item-dto-to-entity.mapper";
import { uuid7GeneratorAdapter } from "@/lib/id-generator/uuid-generator.adapter";
import { itemRepositoryAdapter } from "@/infrastructure/database/adapters/item/item-repository.adapter";

export interface CreateItemUsecaseDeps {
  createItem: (item: CreateItemInputDTO, storeId: StoreId) => Promise<ItemDTO>;
}

export const buildCreateItemUsecase = (deps: CreateItemUsecaseDeps) =>
  authenticatedUsecaseFactory({
    key: "items.create",
    auth: "required",
    requiredPermissions: [PERMISSIONS.ITEMS.CREATE],
    inputSchema: createItemSchema,
    execute: async ({ input, authContext }) => {
      return deps.createItem(input, brand(authContext.storeId));
    },
  });

export const createItemUsecase = buildCreateItemUsecase({
  createItem: async (
    item: CreateItemInputDTO,
    storeId: StoreId,
  ): Promise<ItemDTO> => {
    const itemUUID = uuid7GeneratorAdapter.generate();

    const mappedItem: Item = createItemDTOToEntityMapper.map({
      ...item,
      id: brand(itemUUID),
      categoryId: brand(item.categoryId),
      description: item.description ?? undefined,
      name: item.name,
      number: item.number,
      price: item.price,
      specificationAssignments: item.specificationAssignments.map(
        (specification) => ({
          specificationId: brand(specification.specificationId),
          specificationValueId: brand(specification.specificationValueId),
        }),
      ),
    });

    const createdItem = await itemRepositoryAdapter.create(mappedItem, storeId);

    const itemDTO: ItemDTO = {
      ...createdItem,
    };

    return itemDTO;
  },
});
