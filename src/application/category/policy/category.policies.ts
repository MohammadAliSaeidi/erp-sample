import {
	createRequirePermissionsPolicy,
	createRequirePermissionsPolicyWithoutInput,
	createValidateInputPolicy,
} from "@/src/application/core/usecase/policies/common-policies";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";
import { PERMISSIONS } from "@/src/domain/permission/permissions";
import { createCategorySchema } from "../schema/create-category.schema";
import { editCategorySchema } from "../schema/edit-category.schema";
import { getCategoryByIdSchema } from "../schema/get-category-by-id.schema";

export const validateCreateCategoryInput = createValidateInputPolicy<
	BaseContext,
	typeof createCategorySchema
>("ValidateCreateCategoryInput", createCategorySchema);

export const validateUpdateCategoryInput = createValidateInputPolicy<
	BaseContext,
	typeof editCategorySchema
>("ValidateUpdateCategoryInput", editCategorySchema);

export const validateGetCategoryByIdInput = createValidateInputPolicy<
	BaseContext,
	typeof getCategoryByIdSchema
>("ValidateGetCategoryByIdInput", getCategoryByIdSchema);

export const requireCategoryCreatePermission = createRequirePermissionsPolicy([
	PERMISSIONS.CATEGORIES.CREATE,
]);

export const requireCategoryReadPermission = createRequirePermissionsPolicy([
	PERMISSIONS.CATEGORIES.READ,
]);

export const requireCategoryReadPermissionWithoutInput =
	createRequirePermissionsPolicyWithoutInput([PERMISSIONS.CATEGORIES.READ]);

export const requireCategoryReadDetailsPermission =
	createRequirePermissionsPolicy([PERMISSIONS.CATEGORIES.READ_DETAILS]);

export const requireCategoryUpdatePermission = createRequirePermissionsPolicy([
	PERMISSIONS.CATEGORIES.UPDATE,
]);
