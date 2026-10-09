import { resolveAuthContext } from "@/features/auth";
import { resolveCookieNameFromRequest as resolveCookieNameFromNextRequest } from "@/src/interface/http/resolve-cookie-name-from-request";
import type { NextRequest } from "next/server";

/**
 * Single entry point for API Route Handlers: same JWT + permission loading as SSR,
 * using the request’s cookies and store slug (headers / referer).
 */
export const resolveAuthContextFromNextRequest = async (
	request: NextRequest,
) => {
	const cookieName = resolveCookieNameFromNextRequest(request);

	const token = cookieName
		? (request.cookies.get(cookieName)?.value ?? null)
		: null;

	const authContext = await resolveAuthContext(token);

	if (!authContext) {
		throw new Error("Unauthorized");
	}

	return authContext;
};
