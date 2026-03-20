"use client";

import { useParams } from "next/navigation";

/**
 *
 * @returns store slug in the url. example: https://erp.com/store/[storeSlug]/dashboard --> `storeSlug`
 */
export function useStoreUrlSlug(): string | undefined {
  const params = useParams<{ storeSlug: string | undefined }>();
  const slug = params.storeSlug;

  if (!slug || Array.isArray(slug)) {
    throw new Error("storeSlug not found in URL");
  }

  return slug;
}
