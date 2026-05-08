import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { brand } from "@/lib/brand";
import { itemRepositoryAdapter } from "@/infrastructure/database/adapters/item/item-repository.adapter";
import z from "zod";
import { IItemRepositoryPort } from "@/domain/item/item-repository.port";
import { getItemsEntityToDTOMapper } from "./mappers/get-items-entity-to-dto.mapper";

export interface GetItemsListUsecaseDeps {
  repository: Pick<IItemRepositoryPort, "getList">;
}

export const buildGetItemsListUsecase = (deps: GetItemsListUsecaseDeps) =>
  authenticatedUsecaseFactory({
    key: "items.list",
    auth: "required",
    requiredPermissions: [PERMISSIONS.ITEMS.READ],
    inputSchema: z.object({}),
    execute: async ({ input: {}, authContext: { storeId } }) => {
      const items = await deps.repository.getList(brand(storeId));

      const mappedItem = items.map((item) =>
        getItemsEntityToDTOMapper.map(item),
      );

      return mappedItem;
    },
  });

export const getItemsListUsecase = buildGetItemsListUsecase({
  repository: itemRepositoryAdapter,
});
