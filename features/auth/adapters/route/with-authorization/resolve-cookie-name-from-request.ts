import { resolveAdminAccessTokenCookieName } from "@/features/auth/domain/lib/resolve-admin-access-token-cookie-name";
import { resolveStoreSlugFromRequest } from "./resolve-store-slug-from-request";
import { NextRequest } from "next/server";

export const resolveCookieNameFromRequest = (
	req: NextRequest,
): string | null => {
	const storeSlug = resolveStoreSlugFromRequest(req);
	return resolveAdminAccessTokenCookieName(
		storeSlug ? { storeSlug } : {},
		(req.cookies?.getAll?.() ?? []).map((cookie) => cookie.name),
	);
};
