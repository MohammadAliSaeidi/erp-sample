import { CategoryNotFoundForStoreError } from "@/src/domain/category/errors/category-not-found-for-store.error";
import { CategoryNotFoundError } from "@/src/domain/category/errors/category-not-found.error";
import { InvalidCategoryIdError } from "@/src/domain/category/errors/invalid-category-id.error";
import {
  UseCaseBadRequestError,
  UseCaseNotFoundError,
} from "@/src/application/shared/errors/use-case-errors";

export function mapDomainError(error: unknown): never {
  if (error instanceof CategoryNotFoundForStoreError) {
    throw new UseCaseNotFoundError(error.message);
  }

  if (error instanceof CategoryNotFoundError) {
    throw new UseCaseNotFoundError(error.message);
  }

  if (error instanceof InvalidCategoryIdError) {
    throw new UseCaseBadRequestError(error.message);
  }

  throw error;
}
