import { itemDeps } from "@/src/application/item/composition/item-deps";
import { buildGetItemsListRequest } from "@/src/application/item/composition/item-requests";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { mapUsecaseErrorToResponse } from "@/src/interface/http/map-usecase-error-to-response";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";
import { resolveAuthContextFromRequest } from "@/src/interface/http/resolve-auth-context-from-request";
import { NextRequest, NextResponse } from "next/server";
import { validateRequestJsonBody } from "@/src/interface/http/validate-request-json-body";
import { createItemUsecase } from "@/src/application/item/usecase/create-item.usecase";

const getItemsHandler = async (request: NextRequest) => {
	const authContext = await resolveAuthContextFromRequest(request);

	try {
		const runner = buildUsecaseRunner();
		const items = await runner.runWithInput(
			buildGetItemsListRequest(
				{},
				buildStoreRequestContext(authContext),
				itemDeps.list,
			),
		);

		return NextResponse.json(items);
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	
	}
};

const createItemHandler = async (request: NextRequest) => {
	const authContext = await resolveAuthContextFromRequest(request);

	try {
		const rawBody = await validateRequestJsonBody(request);
		const createdItem = await runUsecase({
			useCase: createItemUsecase,
			input: rawBody,
			authContext,
		});
		return NextResponse.json(createdItem, { status: 201 });
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};


export const GET = getItemsHandler;
export const POST = createItemHandler;
