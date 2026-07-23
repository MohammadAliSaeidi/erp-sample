import { itemDeps } from "@/src/application/item/composition/item-deps";
import {
  buildEditItemRequest,
  buildGetItemByIdRequest,
} from "@/src/application/item/composition/item-requests";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { resolveAuthContextFromRequest } from "@/src/interface/http/ports/resolve-auth-context-from-request.adapter";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";
import { mapUsecaseErrorToResponse } from "@/src/interface/http/map-usecase-error-to-response";
import { validateRequestJsonBody } from "@/src/interface/http/validate-request-json-body";
import { NextRequest, NextResponse } from "next/server";

type ItemRouteContext = {
  params: Promise<{ itemId: string }>;
};

const getItemByIdHandler = async (
  request: NextRequest,
  context: ItemRouteContext,
) => {
  const authContext = await resolveAuthContextFromRequest(request);

  try {
    const { itemId } = await context.params;
    const runner = buildUsecaseRunner();
    const item = await runner.runWithInput(
      buildGetItemByIdRequest(
        { itemId },
        buildStoreRequestContext(authContext),
        itemDeps.getById,
      ),
    );

    return NextResponse.json(item);
  } catch (error) {
    return mapUsecaseErrorToResponse(error);
  }
};

const updateItemHandler = async (
  request: NextRequest,
  context: ItemRouteContext,
) => {
  const authContext = await resolveAuthContextFromRequest(request);

  try {
    const { itemId } = await context.params;
    const rawBody = await validateRequestJsonBody(request);
    const rawInput = {
      ...(typeof rawBody === "object" && rawBody !== null ? rawBody : {}),
      id: itemId,
    };

    const runner = buildUsecaseRunner();
    const updatedItem = await runner.runWithInput(
      buildEditItemRequest(
        rawInput,
        buildStoreRequestContext(authContext),
        itemDeps.edit,
      ),
    );

    return NextResponse.json(updatedItem);
  } catch (error) {
    return mapUsecaseErrorToResponse(error);
  }
};

export const GET = getItemByIdHandler;

export const PUT = updateItemHandler;
