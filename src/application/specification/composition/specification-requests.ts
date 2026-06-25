import {
  requireSpecificationCreatePermission,
  requireSpecificationReadPermission,
  validateCreateSpecificationInput,
  validateGetCategorySpecificationsInput,
} from "@/src/application/specification/policy/specification.policies";
import {
  createSpecificationUsecase,
  type CreateSpecificationUsecaseDeps,
} from "@/src/application/specification/usecase/create-specification.usecase";
import {
  getCategorySpecificationsUsecase,
  type GetCategorySpecificationsUsecaseDeps,
} from "@/src/application/specification/usecase/get-category-specifications.usecase";
import { buildRunWithInputRequest } from "@/src/application/core/usecase/factories";
import { createRequireStoreAuthPolicy } from "@/src/application/core/usecase/policies/common-policies";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";

const requireStoreAuth = createRequireStoreAuthPolicy();

export function buildCreateSpecificationRequest(
  input: unknown,
  context: BaseContext,
  deps: CreateSpecificationUsecaseDeps,
) {
  return buildRunWithInputRequest({
    usecase: createSpecificationUsecase,
    input,
    context,
    deps,
    beforePolicies: [
      validateCreateSpecificationInput,
      requireStoreAuth,
      requireSpecificationCreatePermission,
    ] as const,
  });
}

export function buildGetCategorySpecificationsRequest(
  input: unknown,
  context: BaseContext,
  deps: GetCategorySpecificationsUsecaseDeps,
) {
  return buildRunWithInputRequest({
    usecase: getCategorySpecificationsUsecase,
    input,
    context,
    deps,
    beforePolicies: [
      validateGetCategorySpecificationsInput,
      requireStoreAuth,
      requireSpecificationReadPermission,
    ] as const,
  });
}
