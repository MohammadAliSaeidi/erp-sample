import { getItemsListUsecase } from "@/application/item/usecase/get-items-list.usecase";
import { mapUsecaseErrorToResponse } from "@/features/shared/adapters/http/map-usecase-error-to-response";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { resolveAuthContextFromRequest } from "@/interface/http/resolve-auth-context-from-request";
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
