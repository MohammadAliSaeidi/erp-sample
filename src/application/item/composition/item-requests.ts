import {
  requireItemCreatePermission,
  requireItemReadPermission,
  requireItemUpdatePermission,
  validateCreateItemInput,
  validateEditItemInput,
  validateGetItemByIdInput,
  validateGetItemsListInput,
} from "@/src/application/item/policy/item.policies";
import {
  createItemUsecase,
  type CreateItemUsecaseDeps,
} from "@/src/application/item/usecase/create-item.usecase";
import {
  editItemUsecase,
  type EditItemUsecaseDeps,
} from "@/src/application/item/usecase/edit-item.usecase";
import {
  getItemByIdUsecase,
  type GetItemByIdUsecaseDeps,
} from "@/src/application/item/usecase/get-item-by-id.usecase";
import {
  getItemsListUsecase,
  type GetItemsListUsecaseDeps,
} from "@/src/application/item/usecase/get-items-list.usecase";
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

export function buildEditItemRequest(
  input: unknown,
  context: BaseContext,
  deps: EditItemUsecaseDeps,
) {
  return buildRunWithInputRequest({
    usecase: editItemUsecase,
    input,
    context,
    deps,
    beforePolicies: [
      validateEditItemInput,
      requireStoreAuth,
      requireItemUpdatePermission,
    ] as const,
  });
}

export function buildGetItemsListRequest(
  input: unknown,
  context: BaseContext,
  deps: GetItemsListUsecaseDeps,
) {
  return buildRunWithInputRequest({
    usecase: getItemsListUsecase,
    input,
    context,
    deps,
    beforePolicies: [
      validateGetItemsListInput,
      requireStoreAuth,
      requireItemReadPermission,
    ] as const,
  });
}

export function buildGetItemByIdRequest(
  input: unknown,
  context: BaseContext,
  deps: GetItemByIdUsecaseDeps,
) {
  return buildRunWithInputRequest({
    usecase: getItemByIdUsecase,
    input,
    context,
    deps,
    beforePolicies: [
      validateGetItemByIdInput,
      requireStoreAuth,
      requireItemReadPermission,
    ] as const,
  });
}
