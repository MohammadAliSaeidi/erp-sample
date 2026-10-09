import { categoryDeps } from "@/src/application/category/composition/category-deps";
import {
	buildCreateCategoryRequest,
	buildListCategoriesRequest,
} from "@/src/application/category/composition/category-requests";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";
import { mapUsecaseErrorToResponse } from "@/src/interface/http/map-usecase-error-to-response";
import { resolveAuthContextFromNextRequest } from "@/src/interface/http/resolve-auth-context-from-request";
import { validateRequestJsonBody } from "@/src/interface/http/validate-request-json-body";
import { NextRequest, NextResponse } from "next/server";

const getCategoriesHandler = async (request: NextRequest) => {
	const authContext = await resolveAuthContextFromNextRequest(request);

	try {
		const runner = buildUsecaseRunner();
		const categories = await runner.runWithoutInput(
			buildListCategoriesRequest(
				buildStoreRequestContext(authContext),
				categoryDeps.list,
			),
		);

		return NextResponse.json(categories);
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};

const createCategoryHandler = async (request: NextRequest) => {
	const authContext = await resolveAuthContextFromNextRequest(request);

	try {
		const rawBody = await validateRequestJsonBody(request);
		const runner = buildUsecaseRunner();
		const createdCategory = await runner.runWithInput(
			buildCreateCategoryRequest(
				rawBody,
				buildStoreRequestContext(authContext),
				categoryDeps.create,
			),
		);

		return NextResponse.json(createdCategory, { status: 201 });
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};

export const POST = createCategoryHandler;
export const GET = getCategoriesHandler;
