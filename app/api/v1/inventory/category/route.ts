import { createCategoryUsecase } from "@/application/category/usecase/create-category.usecase";
import { listCategoriesUsecase } from "@/application/category/usecase/list-categories.usecase";
import { resolveAuthContextFromRequest } from "@/interface/http/resolve-auth-context-from-request";
import { mapUsecaseErrorToResponse } from "@/features/shared/adapters/http/map-usecase-error-to-response";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { validateRequestJsonBody } from "@/interface/http/validate-request-json-body";
import { NextRequest, NextResponse } from "next/server";

const getCategoriesHandler = async (request: NextRequest) => {
	const authContext = await resolveAuthContextFromRequest(request);

	try {
		const categories = await runUsecase({
			useCase: listCategoriesUsecase,
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
		const createdCategory = await runUsecase({
			useCase: createCategoryUsecase,
			input: rawBody,
			authContext,
		});

		return NextResponse.json(createdCategory, { status: 201 });
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};

export const POST = createCategoryHandler;
export const GET = getCategoriesHandler;
