import { getCategoryByIdUsecase } from "@/application/category/usecase/get-category-by-id.usecase";
import { mapUsecaseErrorToResponse } from "@/features/shared/adapters/http/map-usecase-error-to-response";
import { runUseCase } from "@/features/shared/application/run-use-case";
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
	try {
		const { authContext } = request as WithAuthContext;
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

export const GET = getCategoryByIdHandler;
