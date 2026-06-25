import {
  createRequirePermissionsPolicy,
  createValidateInputPolicy,
} from "@/src/application/core/usecase/policies/common-policies";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";
import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { createSpecificationSchema } from "../schema/create-specification.schema";
import { getCategorySpecificationsSchema } from "../schema/get-category-specifications.schema";

export const validateCreateSpecificationInput = createValidateInputPolicy<
  BaseContext,
  typeof createSpecificationSchema
>("ValidateCreateSpecificationInput", createSpecificationSchema);

export const validateGetCategorySpecificationsInput = createValidateInputPolicy<
  BaseContext,
  typeof getCategorySpecificationsSchema
>("ValidateGetCategorySpecificationsInput", getCategorySpecificationsSchema);

export const requireSpecificationCreatePermission =
  createRequirePermissionsPolicy([PERMISSIONS.SPECIFICATION.CREATE]);

export const requireSpecificationReadPermission = createRequirePermissionsPolicy(
  [PERMISSIONS.SPECIFICATION.READ],
);
