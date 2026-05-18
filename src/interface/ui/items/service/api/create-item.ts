import { CreateItemInputDTO } from "@/src/application/item/dto/create-item-input.dto";
import { ItemDTO } from "@/src/application/item/dto/item.dto";
import { ApiClient } from "@/lib/api-client";

export const createItem = (body: CreateItemInputDTO, apiClient: ApiClient) => {
  return apiClient.post<ItemDTO>("/api/v1/inventory/item", body);
};
