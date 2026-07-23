import { EditItemInputDTO } from "@/src/application/item/usecase/edit-item.usecase";
import { ApiClient } from "@/lib/api-client";
import { ItemDTO } from "@/src/application/item/dto/item.dto";

export const updateItem = async (
  { id, ...body }: EditItemInputDTO,
  apiClient: ApiClient,
) => await apiClient.put<ItemDTO>(`/api/v1/inventory/item/${id}`, body);
