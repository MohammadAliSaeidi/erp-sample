import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { specificationDeps } from "@/src/application/specification/composition/specification-deps";
import { buildGetCategorySpecificationsRequest } from "@/src/application/specification/composition/specification-requests";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";
import { mapUsecaseErrorToResponse } from "@/src/interface/http/map-usecase-error-to-response";
import { resolveAuthContextFromNextRequest } from "@/src/interface/http/resolve-auth-context-from-request";
import { NextRequest, NextResponse } from "next/server";

type CategorySpecificationsRouteContext = {
	params: Promise<{ categoryId: string }>;
};

const getCategorySpecificationsHandler = async (
	request: NextRequest,
	context: CategorySpecificationsRouteContext,
) => {
	const authContext = await resolveAuthContextFromNextRequest(request);

	try {
		const { categoryId } = await context.params;

		const runner = buildUsecaseRunner();
		const specifications = await runner.runWithInput(
			buildGetCategorySpecificationsRequest(
				{ categoryId },
				buildStoreRequestContext(authContext),
				specificationDeps.listByCategory,
			),
		);

		return NextResponse.json(specifications);
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};

export const GET = getCategorySpecificationsHandler;
