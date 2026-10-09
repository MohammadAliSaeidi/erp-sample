import {
	createRequirePermissionsPolicy,
	createValidateInputPolicy,
} from "@/src/application/core/usecase/policies/common-policies";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";
import { PERMISSIONS } from "@/src/domain/permission/permissions";
import { createItemSchema } from "../schema/create-item.schema";
import { editItemSchema } from "../schema/edit.item.schema";
import { getItemByIdSchema } from "../schema/get-item-by-id.schema";
import { itemListQueryInputSchema } from "../schema/item-list-query.schema";

export const validateCreateItemInput = createValidateInputPolicy<
	BaseContext,
	typeof createItemSchema
>("ValidateCreateItemInput", createItemSchema);

export const validateEditItemInput = createValidateInputPolicy<
	BaseContext,
	typeof editItemSchema
>("ValidateEditItemInput", editItemSchema);

export const validateGetItemsListInput = createValidateInputPolicy<
	BaseContext,
	typeof itemListQueryInputSchema
>("ValidateGetItemsListInput", itemListQueryInputSchema);

export const validateGetItemByIdInput = createValidateInputPolicy<
	BaseContext,
	typeof getItemByIdSchema
>("ValidateGetItemByIdInput", getItemByIdSchema);

export const requireItemCreatePermission = createRequirePermissionsPolicy([
	PERMISSIONS.ITEMS.CREATE,
]);

export const requireItemReadPermission = createRequirePermissionsPolicy([
	PERMISSIONS.ITEMS.READ,
]);

export const requireItemUpdatePermission = createRequirePermissionsPolicy([
	PERMISSIONS.ITEMS.UPDATE,
]);
