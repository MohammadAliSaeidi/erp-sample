import { CategoryNotFoundForStoreError } from "@/domain/category/errors/category-not-found-for-store.error";
import { CategoryNotFoundError } from "@/domain/category/errors/category-not-found.error";
import { InvalidCategoryIdError } from "@/domain/category/errors/invalid-category-id.error";
import {
  UseCaseBadRequestError,
  UseCaseNotFoundError,
} from "@/application/errors/use-case-errors";

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
