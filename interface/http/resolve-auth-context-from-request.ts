import { resolveAuthContext } from "@/features/auth";
import { resolveCookieNameFromRequest } from "@/features/auth/adapters/route/with-authorization/resolve-cookie-name-from-request";
import { resolveStoreSlugFromRequest } from "@/interface/http/resolve-store-slug-from-request";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import type { NextRequest } from "next/server";

/**
 * Single entry point for API Route Handlers: same JWT + permission loading as SSR,
 * using the request’s cookies and store slug (headers / referer).
 */
export async function resolveAuthContextFromRequest(
	request: NextRequest,
): Promise<AuthContext | null> {
	const storeSlug = resolveStoreSlugFromRequest(request) ?? undefined;
	const cookieName = resolveCookieNameFromRequest(request);
	const token =
		cookieName !== null
			? (request.cookies.get(cookieName)?.value ?? null)
			: null;

	return resolveAuthContext({ storeSlug, token });
}
