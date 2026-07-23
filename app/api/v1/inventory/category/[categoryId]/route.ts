import { categoryDeps } from "@/src/application/category/composition/category-deps";
import {
  buildGetCategoryByIdRequest,
  buildUpdateCategoryRequest,
} from "@/src/application/category/composition/category-requests";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { resolveAuthContextFromRequest } from "@/src/interface/http/ports/resolve-auth-context-from-request.adapter";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";
import { mapUsecaseErrorToResponse } from "@/src/interface/http/map-usecase-error-to-response";
import { validateRequestJsonBody } from "@/src/interface/http/validate-request-json-body";
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
		const runner = buildUsecaseRunner();
		const category = await runner.runWithInput(
			buildGetCategoryByIdRequest(
				{ categoryId },
				buildStoreRequestContext(authContext),
				categoryDeps.getById,
			),
		);

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

		const runner = buildUsecaseRunner();
		const updatedCategory = await runner.runWithInput(
			buildUpdateCategoryRequest(
				rawInput,
				buildStoreRequestContext(authContext),
				categoryDeps.update,
			),
		);

		return NextResponse.json(updatedCategory);
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};

export const GET = getCategoryByIdHandler;

export const PUT = updateCategoryHandler;
