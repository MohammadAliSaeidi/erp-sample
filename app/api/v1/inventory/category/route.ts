import { withAuthContext } from "@/features/auth";
import { buildCreateCategoryOperation } from "@/features/categories/application/operations/create-category.operation";
import { buildListCategoriesOperation } from "@/features/categories/application/operations/list-categories.operation";
import { buildCategoryRepository } from "@/features/categories/domain/repositories/categories.repository";
import { mapOperationErrorToResponse } from "@/features/shared/adapters/http/map-operation-error-to-response";
import { runOperation } from "@/features/shared/application/run-operation";
import prisma from "@/features/shared/lib/prisma";
import { validateRequestJsonBody } from "@/features/shared/lib/validate-request-json-body";
import { WithAuthContext } from "@/features/shared/types/next-request-with-auth-context.type";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import { NextResponse } from "next/server";

const categoryRepository = buildCategoryRepository(prisma);
const listCategoriesOperation = buildListCategoriesOperation({
	getListByStoreId: categoryRepository.getList,
});
const createCategoryOperation = buildCreateCategoryOperation({
	createCategory: categoryRepository.create,
});

const getCategoriesHandler: RouteHandler = async (request) => {
	const { authContext } = request as WithAuthContext;

	try {
		const categories = await runOperation({
			operation: listCategoriesOperation,
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
		const createdCategory = await runOperation({
			operation: createCategoryOperation,
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
