import {
  createRequirePermissionsPolicy,
  createValidateInputPolicy,
} from "@/src/application/core/usecase/policies/common-policies";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";
import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { createItemSchema } from "../schema/create-item.schema";

export const validateCreateItemInput = createValidateInputPolicy<
  BaseContext,
  typeof createItemSchema
>("ValidateCreateItemInput", createItemSchema);

export const requireItemCreatePermission = createRequirePermissionsPolicy([
  PERMISSIONS.ITEMS.CREATE,
]);
