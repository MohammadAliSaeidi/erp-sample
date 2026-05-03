import { getCategorySpecificationsUsecase } from "@/application/specification/usecase/get-category-specifications.usecase";
import { resolveAuthContextFromRequest } from "@/interface/http/resolve-auth-context-from-request";
import { mapUsecaseErrorToResponse } from "@/features/shared/adapters/http/map-usecase-error-to-response";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { NextRequest, NextResponse } from "next/server";

type CategorySpecificationsRouteContext = {
	params: Promise<{ categoryId: string }>;
};

const getCategorySpecificationsHandler = async (
	request: NextRequest,
	context: CategorySpecificationsRouteContext,
) => {
	const authContext = await resolveAuthContextFromRequest(request);

	try {
		const { categoryId } = await context.params;

		const category = await runUsecase({
			useCase: getCategorySpecificationsUsecase,
			input: categoryId,
			authContext,
		});

		return NextResponse.json(category);
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};

export const GET = getCategorySpecificationsHandler;
