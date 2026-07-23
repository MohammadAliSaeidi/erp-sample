import { ApiClient } from "@/lib/api-client";
import { ItemDTO } from "@/src/application/item/dto/item.dto";

export const getItemById = async (itemId: string, apiClient: ApiClient) =>
  await apiClient.get<ItemDTO>(`/api/v1/inventory/item/${itemId}`);
