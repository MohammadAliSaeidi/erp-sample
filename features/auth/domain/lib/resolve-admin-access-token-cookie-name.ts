import { getAdminAccessTokenCookieName } from "@/constants/token-names";

const ADMIN_ACCESS_TOKEN_COOKIE_PREFIX = "ADMIN_ACCESS_TOKEN_COOKIE_";

export interface AdminAccessTokenCookieResolutionInput {
	cookieName?: string;
	storeSlug?: string;
}

export const resolveAdminAccessTokenCookieName = (
	input: AdminAccessTokenCookieResolutionInput,
	allCookieNames: string[],
): string | null => {
	if (input.cookieName) return input.cookieName;

	if (input.storeSlug) {
		return getAdminAccessTokenCookieName(input.storeSlug);
	}

	const matches = allCookieNames.filter((cookieName) =>
		cookieName.startsWith(ADMIN_ACCESS_TOKEN_COOKIE_PREFIX),
	);

	if (matches.length === 1) return matches[0];
	return null;
};
