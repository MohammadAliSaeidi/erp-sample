import { ItemDTO } from "@/interface/dto/item/item.dto";
import { ApiClient } from "@/lib/api-client";

export const getItemsList = (apiClient: ApiClient) => {
  return apiClient.get<ItemDTO[]>("/api/v1/inventory/item");
};
