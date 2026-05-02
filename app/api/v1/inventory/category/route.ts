import { createCategoryUsecase } from "@/application/category/usecase/create-category.usecase";
import { buildListCategoriesUsecase } from "@/application/category/usecase/list-categories.usecase";
import { resolveAuthContextFromRequest } from "@/interface/auth/resolve-auth-context-from-request";
import { mapUsecaseErrorToResponse } from "@/features/shared/adapters/http/map-usecase-error-to-response";
import { runUseCase } from "@/features/shared/application/run-use-case";
import { validateRequestJsonBody } from "@/lib/validate-request-json-body";
import { NextRequest, NextResponse } from "next/server";
import { categoryRepositoryAdapter } from "@/infrastructure/database/adapters/category/category-repository.adapter";

const listCategoriesOperation = buildListCategoriesUsecase({
	getListByStoreId: categoryRepositoryAdapter.getList,
});

const getCategoriesHandler = async (request: NextRequest) => {
	const authContext = await resolveAuthContextFromRequest(request);

	try {
		const categories = await runUseCase({
			useCase: listCategoriesOperation,
			input: {},
			authContext,
		});

		return NextResponse.json(categories);
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};

const createCategoryHandler = async (request: NextRequest) => {
	const authContext = await resolveAuthContextFromRequest(request);

	try {
		const rawBody = await validateRequestJsonBody(request);
		const createdCategory = await runUseCase({
			useCase: createCategoryUsecase,
			input: rawBody,
			authContext,
		});

		return NextResponse.json(createdCategory, { status: 201 });
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};

export const GET = getCategoriesHandler;
export const POST = createCategoryHandler;
