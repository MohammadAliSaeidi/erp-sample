import { withAuthContext } from "@/features/auth";
import { buildGetCategoryByIdOperation } from "@/features/categories/application/operations/get-category-by-id.operation";
import { buildUpdateCategoryOperation } from "@/features/categories/application/operations/update-category.operation";
import { buildCategoryRepository } from "@/features/categories/domain/repositories/categories.repository";
import { mapOperationErrorToResponse } from "@/features/shared/adapters/http/map-operation-error-to-response";
import { runOperation } from "@/features/shared/application/run-operation";
import prisma from "@/features/shared/lib/prisma";
import { validateRequestJsonBody } from "@/features/shared/lib/validate-request-json-body";
import { WithAuthContext } from "@/features/shared/types/next-request-with-auth-context.type";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import { NextResponse } from "next/server";

type CategoryRouteContext = {
	params: Promise<{ categoryId: string }>;
};

const categoryRepository = buildCategoryRepository(prisma);
const getCategoryByIdOperation = buildGetCategoryByIdOperation({
	getByIdAndStoreId: categoryRepository.getById,
});
const updateCategoryOperation = buildUpdateCategoryOperation({
	updateCategory: categoryRepository.update,
});

const getCategoryByIdHandler: RouteHandler<CategoryRouteContext> = async (
	request,
	context,
) => {
	const { authContext } = request as WithAuthContext;

	try {
		const { categoryId } = await context.params;
		const category = await runOperation({
			operation: getCategoryByIdOperation,
			rawInput: { categoryId },
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
		const updatedCategory = await runOperation({
			operation: updateCategoryOperation,
			rawInput,
			authContext,
		});

		return NextResponse.json(updatedCategory);
	} catch (error) {
		return mapOperationErrorToResponse(error);
	}
};

export const GET: RouteHandler<CategoryRouteContext> =
	withAuthContext(getCategoryByIdHandler);
export const PUT: RouteHandler<CategoryRouteContext> =
	withAuthContext(updateCategoryHandler);
