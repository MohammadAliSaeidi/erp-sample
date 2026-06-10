import {
  requireCategoryCreatePermission,
  requireCategoryReadDetailsPermission,
  requireCategoryReadPermission,
  requireCategoryReadPermissionWithoutInput,
  requireCategoryUpdatePermission,
  validateCreateCategoryInput,
  validateGetCategoryByIdInput,
  validateUpdateCategoryInput,
} from "@/src/application/category/policy/category.policies";
import {
  createCategoryUsecase,
  type CreateCategoryUsecaseDeps,
} from "@/src/application/category/usecase/create-category.usecase";
import {
  getCategoryByIdUsecase,
  type GetCategoryByIdUsecaseDeps,
} from "@/src/application/category/usecase/get-category-by-id.usecase";
import {
  listCategoriesUsecase,
  type ListCategoriesUsecaseDeps,
} from "@/src/application/category/usecase/list-categories.usecase";
import {
  updateCategoryUsecase,
  type UpdateCategoryUsecaseDeps,
} from "@/src/application/category/usecase/update-category.usecase";
import {
  buildRunWithInputRequest,
  buildRunWithoutInputRequest,
} from "@/src/application/core/usecase/factories";
import {
  createRequireStoreAuthPolicy,
  createRequireStoreAuthPolicyWithoutInput,
} from "@/src/application/core/usecase/policies/common-policies";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";

const requireStoreAuth = createRequireStoreAuthPolicy();
const requireStoreAuthWithoutInput = createRequireStoreAuthPolicyWithoutInput();

export function buildCreateCategoryRequest(
  input: unknown,
  context: BaseContext,
  deps: CreateCategoryUsecaseDeps,
) {
  return buildRunWithInputRequest({
    usecase: createCategoryUsecase,
    input,
    context,
    deps,
    beforePolicies: [
      validateCreateCategoryInput,
      requireStoreAuth,
      requireCategoryCreatePermission,
    ] as const,
  });
}

export function buildListCategoriesRequest(
  context: BaseContext,
  deps: ListCategoriesUsecaseDeps,
) {
  return buildRunWithoutInputRequest({
    usecase: listCategoriesUsecase,
    context,
    deps,
    beforePolicies: [
      requireStoreAuthWithoutInput,
      requireCategoryReadPermissionWithoutInput,
    ] as const,
  });
}

export function buildGetCategoryByIdRequest(
  input: unknown,
  context: BaseContext,
  deps: GetCategoryByIdUsecaseDeps,
) {
  return buildRunWithInputRequest({
    usecase: getCategoryByIdUsecase,
    input,
    context,
    deps,
    beforePolicies: [
      validateGetCategoryByIdInput,
      requireStoreAuth,
      requireCategoryReadDetailsPermission,
    ] as const,
  });
}

export function buildUpdateCategoryRequest(
  input: unknown,
  context: BaseContext,
  deps: UpdateCategoryUsecaseDeps,
) {
  return buildRunWithInputRequest({
    usecase: updateCategoryUsecase,
    input,
    context,
    deps,
    beforePolicies: [
      validateUpdateCategoryInput,
      requireStoreAuth,
      requireCategoryUpdatePermission,
    ] as const,
  });
}
