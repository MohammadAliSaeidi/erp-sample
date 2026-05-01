import { withAuthContext } from "@/features/auth";
import { getCategoryByIdUsecase } from "@/application/category/usecase/get-category-by-id.usecase";
import { updateCategoryUsecase } from "@/application/category/usecase/update-category.usecase";
import { mapUsecaseErrorToResponse } from "@/features/shared/adapters/http/map-usecase-error-to-response";
import { runUseCase } from "@/features/shared/application/run-use-case";
import { validateRequestJsonBody } from "@/lib/validate-request-json-body";
import { WithAuthContext } from "@/features/shared/types/next-request-with-auth-context.type";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import { NextResponse } from "next/server";

type CategoryRouteContext = {
	params: Promise<{ categoryId: string }>;
};

const getCategoryByIdHandler: RouteHandler<CategoryRouteContext> = async (
	request,
	context,
) => {
	const { authContext } = request as WithAuthContext;

	try {
		const { categoryId } = await context.params;
		const category = await runUseCase({
			useCase: getCategoryByIdUsecase,
			input: { categoryId },
			authContext,
		});

		return NextResponse.json(category);
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
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
		return mapUsecaseErrorToResponse(error);
	}
};

export const GET: RouteHandler<CategoryRouteContext> = withAuthContext(
	getCategoryByIdHandler,
);

export const PUT: RouteHandler<CategoryRouteContext> = withAuthContext(
	updateCategoryHandler,
);
