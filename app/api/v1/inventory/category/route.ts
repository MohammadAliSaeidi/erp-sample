import { withAuthContext } from "@/features/auth";
import { buildCreateCategoryUsecase } from "@/features/categories/application/operations/create-category.operation";
import { makeListCategoriesUseCase } from "@/features/categories/application/operations/list-categories.operation";
import { mapOperationErrorToResponse } from "@/features/shared/adapters/http/map-operation-error-to-response";
import { runUseCase } from "@/features/shared/application/run-use-case";
import { validateRequestJsonBody } from "@/lib/validate-request-json-body";
import { WithAuthContext } from "@/features/shared/types/next-request-with-auth-context.type";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import { NextResponse } from "next/server";
import { categoryRepositoryAdapter } from "@/features/specifications/infrastructure/database/adapters/category/category-repository.adapter";

const listCategoriesOperation = makeListCategoriesUseCase({
	getListByStoreId: categoryRepositoryAdapter.getList,
});

const createCategoryOperation = buildCreateCategoryUsecase({
	createCategory: categoryRepositoryAdapter.create,
});

const getCategoriesHandler: RouteHandler = async (request) => {
	const { authContext } = request as WithAuthContext;

	try {
		const categories = await runUseCase({
			useCase: listCategoriesOperation,
			input: {},
			authContext,
		});

		return NextResponse.json(categories);
	} catch (error) {
		return mapOperationErrorToResponse(error);
	}
};

const createCategoryHandler: RouteHandler = async (request) => {
	const { authContext } = request as WithAuthContext;

	try {
		const rawBody = await validateRequestJsonBody(request);
		const createdCategory = await runUseCase({
			useCase: createCategoryOperation,
			input: rawBody,
			authContext,
		});

		return NextResponse.json(createdCategory, { status: 201 });
	} catch (error) {
		return mapOperationErrorToResponse(error);
	}
};

export const GET: RouteHandler = withAuthContext(getCategoriesHandler);
export const POST: RouteHandler = withAuthContext(createCategoryHandler);
