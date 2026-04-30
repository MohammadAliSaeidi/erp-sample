import { withAuthContext } from "@/features/auth";
import { buildGetCategoryByIdUsecase } from "@/application/category/usecase/get-category-by-id.usecase";
import { updateCategoryUsecase } from "@/features/categories/application/operations/update-category.operation";
import { mapOperationErrorToResponse } from "@/features/shared/adapters/http/map-operation-error-to-response";
import { runUseCase } from "@/features/shared/application/run-use-case";
import { validateRequestJsonBody } from "@/lib/validate-request-json-body";
import { WithAuthContext } from "@/features/shared/types/next-request-with-auth-context.type";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import { NextResponse } from "next/server";
import { categoryRepositoryAdapter } from "@/infrastructure/database/adapters/category/category-repository.adapter";

type CategoryRouteContext = {
	params: Promise<{ categoryId: string }>;
};

const getCategoryByIdOperation = buildGetCategoryByIdUsecase({
	getByIdAndStoreId: categoryRepositoryAdapter.getById,
});

const getCategoryByIdHandler: RouteHandler<CategoryRouteContext> = async (
	request,
	context,
) => {
	const { authContext } = request as WithAuthContext;

	try {
		const { categoryId } = await context.params;
		const category = await runUseCase({
			useCase: getCategoryByIdOperation,
			input: { categoryId },
			authContext,
		});

		return NextResponse.json(category);
	} catch (error) {
		return mapOperationErrorToResponse(error);
	}
};

const updateCategoryHandler: RouteHandler<CategoryRouteContext> = async (
	request,
	context,
) => {
	const { authContext } = request as WithAuthContext;

	try {
		const { categoryId } = await context.params;
		const rawBody = await validateRequestJsonBody(request);
		const rawInput = {
			...(typeof rawBody === "object" && rawBody !== null ? rawBody : {}),
			id: categoryId,
		};

		const updatedCategory = await runUseCase({
			useCase: updateCategoryUsecase,
			input: rawInput,
			authContext,
		});

		return NextResponse.json(updatedCategory);
	} catch (error) {
		return mapOperationErrorToResponse(error);
	}
};

export const GET: RouteHandler<CategoryRouteContext> = withAuthContext(
	getCategoryByIdHandler,
);
export const PUT: RouteHandler<CategoryRouteContext> = withAuthContext(
	updateCategoryHandler,
);
