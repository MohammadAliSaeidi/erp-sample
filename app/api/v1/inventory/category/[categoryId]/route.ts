import { getCategoryByIdUsecase } from "@/application/category/usecase/get-category-by-id.usecase";
import { updateCategoryUsecase } from "@/application/category/usecase/update-category.usecase";
import { resolveAuthContextFromRequest } from "@/interface/http/resolve-auth-context-from-request";
import { mapUsecaseErrorToResponse } from "@/features/shared/adapters/http/map-usecase-error-to-response";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { validateRequestJsonBody } from "@/interface/http/validate-request-json-body";
import { NextRequest, NextResponse } from "next/server";

type CategoryRouteContext = {
	params: Promise<{ categoryId: string }>;
};

const getCategoryByIdHandler = async (
	request: NextRequest,
	context: CategoryRouteContext,
) => {
	const authContext = await resolveAuthContextFromRequest(request);

	try {
		const { categoryId } = await context.params;
		const category = await runUsecase({
			useCase: getCategoryByIdUsecase,
			input: { categoryId },
			authContext,
		});

		return NextResponse.json(category);
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};

const updateCategoryHandler = async (
	request: NextRequest,
	context: CategoryRouteContext,
) => {
	const authContext = await resolveAuthContextFromRequest(request);

	try {
		const { categoryId } = await context.params;
		const rawBody = await validateRequestJsonBody(request);
		const rawInput = {
			...(typeof rawBody === "object" && rawBody !== null ? rawBody : {}),
			id: categoryId,
		};

		const updatedCategory = await runUsecase({
			useCase: updateCategoryUsecase,
			input: rawInput,
			authContext,
		});

		return NextResponse.json(updatedCategory);
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};

export const GET = getCategoryByIdHandler;

export const PUT = updateCategoryHandler;
