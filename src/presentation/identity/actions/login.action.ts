"use server";

import { setTokenCookie } from "@/lib/token";
import { loginDeps } from "@/src/application/auth/composition/login-deps";
import { buildLoginRequest } from "@/src/application/auth/composition/login-request";
import { LoginInputDTO } from "@/src/application/auth/usecase/login-input-dto.type";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import {
	ActionResult,
	actionSuccess,
	mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { buildPublicRequestContext } from "@/src/interface/http/build-public-request-context";

export async function loginAction(
	loginInput: LoginInputDTO,
): Promise<ActionResult<null>> {
	try {
		const runner = buildUsecaseRunner();
		const loginResult = await runner.runWithInput(
			buildLoginRequest(
				loginInput,
				buildPublicRequestContext(),
				loginDeps,
			),
		);

		await setTokenCookie(
			loginResult.cookieName,
			loginResult.tokenPayload,
		);

		return actionSuccess(null);
	} catch (error) {
		return mapUsecaseErrorToActionResult(error);
	}
}
