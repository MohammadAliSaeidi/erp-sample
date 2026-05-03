import { resolveStoreSlugFromRequest } from "@/interface/http/resolve-store-slug-from-request";
import { buildLoginOperation } from "@/features/auth/application/operations/login.operation";
import { mapUsecaseErrorToResponse } from "@/features/shared/adapters/http/map-usecase-error-to-response";
import { runUsecase } from "@/features/shared/application/run-use-case";
import prisma from "@/lib/prisma";
import { validateRequestJsonBody } from "@/interface/http/validate-request-json-body";
import { setTokenCookie } from "@/lib/token";
import { isHashMatch } from "@/lib/utils/hash/hash";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import { NextRequest, NextResponse } from "next/server";
import { UseCaseBadRequestError } from "@/application/errors/use-case-errors";

const loginOperation = buildLoginOperation({
	findStoreBySlug: async (storeSlug) => {
		return prisma.store.findUnique({
			where: { slug: storeSlug },
			select: { id: true, slug: true },
		});
	},
	findStoreUserByStoreAndUsername: async (storeId, username) => {
		const storeUser = await prisma.storeUser.findUnique({
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
				role: {
					select: {
						grantsAll: true,
					},
				},
			},
		});

		return storeUser
			? {
					id: storeUser.id,
					name: storeUser.name,
					storeId: storeUser.storeId,
					username: storeUser.username,
					roleId: storeUser.roleId,
					password: storeUser.password,
					grantsAll: storeUser.role?.grantsAll ?? false,
				}
			: null;
	},
	isPasswordMatch: isHashMatch,
});

export const POST: RouteHandler = async (request: NextRequest) => {
	try {
		const rawBody = await validateRequestJsonBody(request);
		const storeSlug = resolveStoreSlugFromRequest(request);

		if (!storeSlug)
			return mapUsecaseErrorToResponse(new UseCaseBadRequestError());

		const loginResult = await runUsecase({
			useCase: loginOperation,
			input: rawBody as {
				username: string;
				password: string;
				storeSlug: string;
			},
		});

		await setTokenCookie(loginResult.cookieName, loginResult.tokenPayload);

		return NextResponse.json(null, {
			status: 200,
			statusText: "logged in successfully",
		});
	} catch (error) {
		return mapUsecaseErrorToResponse(error);
	}
};
