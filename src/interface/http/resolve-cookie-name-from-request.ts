import { resolveAdminAccessTokenCookieName } from "@/features/auth/domain/lib/resolve-admin-access-token-cookie-name";
import { NextRequest } from "next/server";
import { resolveStoreSlugFromRequest } from "../../../features/auth/adapters/route/with-authorization/resolve-store-slug-from-request";

export const resolveCookieNameFromRequest = (
	req: NextRequest,
): string | null => {
	const storeSlug = resolveStoreSlugFromRequest(req);
	return resolveAdminAccessTokenCookieName(
		storeSlug ? { storeSlug } : {},
		(req.cookies?.getAll?.() ?? []).map((cookie) => cookie.name),
	);
};
