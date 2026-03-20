import { CreateItemBody } from "@/features/items/types/create-item-body.type";
import { AxiosInstance } from "axios";

export const createItem = async (http: AxiosInstance, body: CreateItemBody) =>
  await http.post<CreateItemBody>("/api/v1/inventory/item", body);
