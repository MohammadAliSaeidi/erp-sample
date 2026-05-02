import { getCategorySpecificationsUsecase } from "@/application/specification/usecase/get-category-specifications.usecase";
import { withAuthContext } from "@/features/auth";
import { mapUsecaseErrorToResponse } from "@/features/shared/adapters/http/map-usecase-error-to-response";
import { runUseCase } from "@/features/shared/application/run-use-case";
import { WithAuthContext } from "@/features/shared/types/next-request-with-auth-context.type";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import { NextResponse } from "next/server";

type CategorySpecificationsRouteContext = {
	params: Promise<{ categoryId: string }>;
};

const getCategorySpecificationsHandler: RouteHandler<
	CategorySpecificationsRouteContext
> = async (request, context) => {
	try {
		const { authContext } = request as WithAuthContext;
		const { categoryId } = await context.params;

		const category = await runUseCase({
			useCase: getCategorySpecificationsUsecase,
			input: categoryId,
			authContext,
		});

		return NextResponse.json(category);
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};

export const GET: RouteHandler<CategorySpecificationsRouteContext> =
	withAuthContext(getCategorySpecificationsHandler);
