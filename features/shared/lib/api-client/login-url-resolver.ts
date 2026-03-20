import { getStoreSlugFromPath } from "../utils/get-store-slug-from-path";

const LOGIN_PAGES = {} as const;
type LoginPagePrefix = keyof typeof LOGIN_PAGES;
const LOGIN_PAGE_PREFIXES = Object.keys(LOGIN_PAGES) as LoginPagePrefix[];

function resolveStoreLoginUrl(currentPath: string): string | null {
	const storeSlug = getStoreSlugFromPath(currentPath);
	if (!storeSlug) return null;
	return `/store/${storeSlug}/login`;
}

function resolveDefaultLoginUrl(currentPath: string): string {
	const matchedPrefix = LOGIN_PAGE_PREFIXES.find((prefix) =>
		currentPath.startsWith(prefix),
	);
	return matchedPrefix ? LOGIN_PAGES[matchedPrefix] : "/login";
}

export function resolveLoginUrl(currentPath: string): string {
	return (
		resolveStoreLoginUrl(currentPath) ??
		resolveDefaultLoginUrl(currentPath)
	);
}
