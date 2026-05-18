import { NotFoundError } from "@/src/domain/shared/errors/not-found-error";

export class CategoryNotFoundForStoreError extends NotFoundError {
  constructor(categoryId: string, storeId: string) {
    super(`Category ${categoryId} not found for store ${storeId}`);
  }
}
