import { CreateItemInputDTO } from "@/interface/dto/item/create-item-input.dto";
import { ItemDTO } from "@/interface/dto/item/item.dto";
import { ApiClient } from "@/lib/api-client";

export const createItem = (body: CreateItemInputDTO, apiClient: ApiClient) => {
  return apiClient.post<ItemDTO>("/api/v1/inventory/item", body);
};
