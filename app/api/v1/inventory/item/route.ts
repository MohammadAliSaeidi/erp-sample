import { getItemsListUsecase } from "@/src/application/item/usecase/get-items-list.usecase";
import { mapUsecaseErrorToResponse } from "@/src/interface/http/map-usecase-error-to-response";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { resolveAuthContextFromRequest } from "@/src/interface/http/resolve-auth-context-from-request";
import { NextRequest, NextResponse } from "next/server";
import { validateRequestJsonBody } from "@/src/interface/http/validate-request-json-body";
import { createItemUsecase } from "@/src/application/item/usecase/create-item.usecase";

const getItemsHandler = async (request: NextRequest) => {
	const authContext = await resolveAuthContextFromRequest(request);

	try {
		const categories = await runUsecase({
			useCase: getItemsListUsecase,
			input: {},
			authContext,
		});

		return NextResponse.json(categories);
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
