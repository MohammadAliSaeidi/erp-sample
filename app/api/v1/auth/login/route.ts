import { resolveStoreSlugFromRequest } from "@/adapters/http/resolve-store-slug-from-request";
import { buildLoginOperation } from "@/features/auth/application/operations/login.operation";
import { mapOperationErrorToResponse } from "@/features/shared/adapters/http/map-operation-error-to-response";
import { runOperation } from "@/features/shared/application/run-operation";
import prisma from "@/features/shared/lib/prisma";
import { validateRequestJsonBody } from "@/features/shared/lib/validate-request-json-body";
import { setTokenCookie } from "@/features/shared/lib/token";
import { isHashMatch } from "@/features/shared/lib/utils/hash/hash";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import { NextRequest, NextResponse } from "next/server";

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

export const POST: RouteHandler = async (request: NextRequest) => {
	try {
		const rawBody = await validateRequestJsonBody(request);
		const storeSlug = resolveStoreSlugFromRequest(request);
		const loginResult = await runOperation({
			operation: loginOperation,
			rawInput: { ...((rawBody as object) ?? {}), storeSlug },
		});

		await setTokenCookie(loginResult.cookieName, loginResult.tokenPayload);

		return NextResponse.json(null, {
			status: 200,
			statusText: "logged in successfully",
		});
	} catch (error) {
		return mapOperationErrorToResponse(error);
	}
};
