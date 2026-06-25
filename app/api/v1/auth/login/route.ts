import { loginDeps } from "@/src/application/auth/composition/login-deps";
import { buildLoginRequest } from "@/src/application/auth/composition/login-request";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { resolveStoreSlugFromRequest } from "@/src/interface/http/resolve-store-slug-from-request";
import { buildPublicRequestContext } from "@/src/interface/http/build-public-request-context";
import { mapUsecaseErrorToResponse } from "@/src/interface/http/map-usecase-error-to-response";
import { validateRequestJsonBody } from "@/src/interface/http/validate-request-json-body";
import { setTokenCookie } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";
import { BadRequestError } from "@/src/application/core/errors/application.error";

export const POST = async (request: NextRequest) => {
	try {
		const rawBody = await validateRequestJsonBody(request);
		const storeSlug = resolveStoreSlugFromRequest(request);

		if (!storeSlug)
			return mapUsecaseErrorToResponse(new BadRequestError());

		const runner = buildUsecaseRunner();
		const loginResult = await runner.runWithInput(
			buildLoginRequest(
				{
					...(typeof rawBody === "object" && rawBody !== null ? rawBody : {}),
					storeSlug,
				},
				buildPublicRequestContext(),
				loginDeps,
			),
		);

		await setTokenCookie(loginResult.cookieName, loginResult.tokenPayload);

		return NextResponse.json(null, {
			status: 200,
			statusText: "logged in successfully",
		});
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};
