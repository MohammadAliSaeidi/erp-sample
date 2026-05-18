import { SpecificationDTO } from "@/src/application/specification/dto/specification.dto";
import { ApiClient } from "@/lib/api-client";

export const getCategorySpecifications = (
  apiClient: ApiClient,
  categoryId: string,
) => {
  return apiClient.get<SpecificationDTO[]>(
    `/api/v1/inventory/category/${categoryId}/specifications`,
  );
};
