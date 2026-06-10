import {
  requireItemCreatePermission,
  validateCreateItemInput,
} from "@/src/application/item/policy/item.policies";
import {
  createItemUsecase,
  type CreateItemUsecaseDeps,
} from "@/src/application/item/usecase/create-item.usecase";
import { buildRunWithInputRequest } from "@/src/application/core/usecase/factories";
import { createRequireStoreAuthPolicy } from "@/src/application/core/usecase/policies/common-policies";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";

const requireStoreAuth = createRequireStoreAuthPolicy();

export function buildCreateItemRequest(
  input: unknown,
  context: BaseContext,
  deps: CreateItemUsecaseDeps,
) {
  return buildRunWithInputRequest({
    usecase: createItemUsecase,
    input,
    context,
    deps,
    beforePolicies: [
      validateCreateItemInput,
      requireStoreAuth,
      requireItemCreatePermission,
    ] as const,
  });
}
