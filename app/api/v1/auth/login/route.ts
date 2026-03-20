import { ADMIN_ACCESS_TOKEN_COOKIE_NAME } from "@/constants/token-names";
import { loginBodySchema } from "@/features/auth/domain/schemas/login-body.schema";
import { LoginBody } from "@/features/auth/domain/types/login-body.type";
import prisma from "@/features/shared/lib/prisma";
import { setTokenCookie } from "@/features/shared/lib/token";
import { getStoreSlugFromPath } from "@/features/shared/lib/utils/get-store-slug-from-path";
import { isHashMatch } from "@/features/shared/lib/utils/hash/hash";
import { compose } from "@/features/shared/middlewares/compose";
import { bodyValidator } from "@/features/shared/middlewares/validate-body";
import { AdminAccessTokenPayload } from "@/features/shared/types/admin-access-token-payload";
import { WithValidatedBody } from "@/features/shared/types/next-request-with-validated-body";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import { NextRequest, NextResponse } from "next/server";

async function loginHandler(request: NextRequest) {
	const { validatedBody: body } = request as WithValidatedBody<LoginBody>;

	if (!body) {
		return NextResponse.json(
			{ error: "Request body missing" },
			{ status: 400, statusText: "Validated body missing" },
		);
	}

	const referer = request.headers.get("referer");

	if (!referer)
		return NextResponse.json(null, {
			status: 400,
			statusText: "Request header referer is missing",
		});

	const storeSlug = getStoreSlugFromPath(referer);

	if (!storeSlug) {
		return NextResponse.json(null, {
			status: 400,
			statusText: "Store slug was not found in referer",
		});
	}

	const store = await prisma.store.findUnique({
		where: {
			slug: storeSlug,
		},
	});

	if (!store)
		return NextResponse.json(null, {
			status: 404,
			statusText: "Store Not Found",
		});

	const storeUser = await prisma.storeUser.findUnique({
		where: {
			storeId_username: {
				storeId: store.id,
				username: body.username,
			},
		},
	});

	const isValidCredentials =
		storeUser && (await isHashMatch(body.password, storeUser.password));

	if (!isValidCredentials) {
		return NextResponse.json(
			{},
			{ status: 401, statusText: "Incorrect username or password" },
		);
	}

	const cookieName = ADMIN_ACCESS_TOKEN_COOKIE_NAME(storeSlug);

	await setTokenCookie<AdminAccessTokenPayload>(cookieName, {
		sub: storeUser.id,
		adminId: storeUser.id,
		name: storeUser.name,
		storeId: storeUser.storeId,
		storeSlug,
		username: storeUser.username,
		roleId: storeUser.roleId,
	});

	// const cookieStore = await cookies();
	// cookieStore.set(STORE_SLUG_COOKIE_NAME, storeSlug);

	return NextResponse.json(null, {
		status: 200,
		statusText: "logged in successfully",
	});
}

const wrappedHandler = compose(bodyValidator(loginBodySchema))(loginHandler);

export const POST: RouteHandler = (request: NextRequest, context: unknown) => {
	return wrappedHandler(request, context);
};
