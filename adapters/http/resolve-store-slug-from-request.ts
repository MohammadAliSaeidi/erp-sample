import { getStoreSlugFromPath } from "@/features/shared/lib/utils/get-store-slug-from-path";
import { NextRequest } from "next/server";

export const resolveStoreSlugFromRequest = (
	req: Pick<NextRequest, "headers">,
): string | null => {
	const headerSlug = req.headers?.get?.("x-store-slug")?.trim();
	if (headerSlug) return headerSlug;

	const referer = req.headers?.get?.("referer");
	if (!referer) return null;

	return getStoreSlugFromPath(referer);
};
