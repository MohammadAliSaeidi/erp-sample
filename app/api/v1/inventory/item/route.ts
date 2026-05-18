import { getItemsListUsecase } from "@/src/application/item/usecase/get-items-list.usecase";
import { mapUsecaseErrorToResponse } from "@/src/interface/http/map-usecase-error-to-response";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { resolveAuthContextFromRequest } from "@/src/interface/http/resolve-auth-context-from-request";
import { NextRequest, NextResponse } from "next/server";

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

export const GET = getItemsHandler;
