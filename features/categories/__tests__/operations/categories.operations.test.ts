import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { CategoryNotFoundForStoreError } from "@/features/categories/domain/errors/category-not-found-for-store.error";
import {
	buildCreateCategoryOperation,
	CreateCategoryOperationDeps,
} from "@/features/categories/application/operations/create-category.operation";
import {
	buildGetCategoryByIdOperation,
	GetCategoryByIdOperationDeps,
} from "@/features/categories/application/operations/get-category-by-id.operation";
import {
	buildListCategoriesOperation,
	ListCategoriesOperationDeps,
} from "@/features/categories/application/operations/list-categories.operation";
import {
	buildUpdateCategoryOperation,
	UpdateCategoryOperationDeps,
} from "@/features/categories/application/operations/update-category.operation";
import {
	OperationForbiddenError,
	OperationNotFoundError,
	OperationValidationError,
} from "@/features/shared/application/errors/operation-errors";
import { runOperation } from "@/features/shared/application/run-operation";

const STORE_ID = "store-1";
const CATEGORY_ID = "11111111-1111-4111-8111-111111111111";

const AUTH_CONTEXT: AuthContext = {
	adminId: "admin-1",
	storeId: STORE_ID,
	storeSlug: "store-1",
	username: "admin-user",
	roleId: "role-1",
	permissions: [
		"categories:read",
		"categories:read-details",
		"categories:create",
		"categories:update",
	],
};

describe("categories operations", () => {
	it("lists categories for the authenticated store", async () => {
		const deps: ListCategoriesOperationDeps = {
			getListByStoreId: jest.fn().mockResolvedValue([
				{ id: CATEGORY_ID, name: "Phones", storeId: STORE_ID },
			]),
		};
		const operation = buildListCategoriesOperation(deps);

		const result = await runOperation({
			operation,
			rawInput: {},
			authContext: AUTH_CONTEXT,
		});

		expect(result).toHaveLength(1);
		expect(deps.getListByStoreId).toHaveBeenCalledWith(STORE_ID);
	});

	it("fails with OperationForbiddenError when permission is missing", async () => {
		const deps: ListCategoriesOperationDeps = {
			getListByStoreId: jest.fn(),
		};
		const operation = buildListCategoriesOperation(deps);

		await expect(
			runOperation({
				operation,
				rawInput: {},
				authContext: { ...AUTH_CONTEXT, permissions: [] },
			}),
		).rejects.toBeInstanceOf(OperationForbiddenError);
	});

	it("validates create input using the operation schema", async () => {
		const deps: CreateCategoryOperationDeps = {
			createCategory: jest.fn(),
		};
		const operation = buildCreateCategoryOperation(deps);

		await expect(
			runOperation({
				operation,
				rawInput: { name: "" },
				authContext: AUTH_CONTEXT,
			}),
		).rejects.toBeInstanceOf(OperationValidationError);
	});

	it("returns not found when get by id misses", async () => {
		const deps: GetCategoryByIdOperationDeps = {
			getByIdAndStoreId: jest.fn().mockResolvedValue(null),
		};
		const operation = buildGetCategoryByIdOperation(deps);

		await expect(
			runOperation({
				operation,
				rawInput: { categoryId: CATEGORY_ID },
				authContext: AUTH_CONTEXT,
			}),
		).rejects.toBeInstanceOf(OperationNotFoundError);
	});

	it("maps repository not-found during update into OperationNotFoundError", async () => {
		const deps: UpdateCategoryOperationDeps = {
			updateCategory: jest
				.fn()
				.mockRejectedValue(new CategoryNotFoundForStoreError(CATEGORY_ID)),
		};
		const operation = buildUpdateCategoryOperation(deps);

		await expect(
			runOperation({
				operation,
				rawInput: {
					id: CATEGORY_ID,
					name: "Updated",
				},
				authContext: AUTH_CONTEXT,
			}),
		).rejects.toBeInstanceOf(OperationNotFoundError);
	});
});
