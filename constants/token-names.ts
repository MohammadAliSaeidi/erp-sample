import { convertToScreamingSnakeCase } from "@/features/shared/lib/utils/to-screaming-snake-case";

export const getAdminAccessTokenCookieName = (storeSlug: string) =>
	`ADMIN_ACCESS_TOKEN_COOKIE_${convertToScreamingSnakeCase(storeSlug)}`;
