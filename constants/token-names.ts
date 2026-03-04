import { convertToScreamingSnakeCase } from "@/lib/utils/to-screaming-snake-case";

export const ADMIN_ACCESS_TOKEN_COOKIE_NAME = (storeSlug: string) =>
	`ADMIN_ACCESS_TOKEN_COOKIE_${convertToScreamingSnakeCase(storeSlug)}`;

export const STORE_SLUG_COOKIE_NAME = 'STORE_SLUG'