"use client";

import { useParams } from "next/navigation";

/**
 *
 * @returns store slug in the url. example: https://erp.com/store/[storeSlug]/dashboard --> `storeSlug`
 */
export function useStoreUrlSlug(): string {
	const params = useParams<{ storeSlug: string }>();
	const slug = params.storeSlug;

	if (!slug || Array.isArray(slug)) {
		throw new Error("storeSlug not found in URL");
	}

	return slug;
}
