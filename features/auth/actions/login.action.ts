"use server";

import { buildLoginOperation } from "@/features/auth/application/operations/login.operation";
import {
	ActionResult,
	actionSuccess,
	mapOperationErrorToActionResult,
} from "@/features/shared/adapters/action/map-operation-error-to-action-result";
import { runOperation } from "@/features/shared/application/run-operation";
import prisma from "@/features/shared/lib/prisma";
import { setTokenCookie } from "@/features/shared/lib/token";
import { isHashMatch } from "@/features/shared/lib/utils/hash/hash";

const loginOperation = buildLoginOperation({
	findStoreBySlug: async (storeSlug) => {
		return prisma.store.findUnique({
			where: { slug: storeSlug },
			select: { id: true, slug: true },
		});
	},
	findStoreUserByStoreAndUsername: async (storeId, username) => {
		return prisma.storeUser.findUnique({
			where: {
				storeId_username: { storeId, username },
			},
			select: {
				id: true,
				name: true,
				storeId: true,
				username: true,
				roleId: true,
				password: true,
			},
		});
	},
	isPasswordMatch: isHashMatch,
});

export async function loginAction(rawInput: unknown): Promise<ActionResult<null>> {
	try {
		const loginResult = await runOperation({
			operation: loginOperation,
			rawInput,
		});

		await setTokenCookie(loginResult.cookieName, loginResult.tokenPayload);

		return actionSuccess(null);
	} catch (error) {
		return mapOperationErrorToActionResult(error);
	}
}
