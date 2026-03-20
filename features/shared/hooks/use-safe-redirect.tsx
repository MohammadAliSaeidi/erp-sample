"use client";

import { getSafeRedirect } from "@/features/shared/lib/redirect-utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export interface UseSafeRedirectOptions {
  /**
   * Query param key to read (default: 'redirect')
   */
  paramKey?: string;

  /**
   * Default fallback path (default: '/dashboard')
   */
  defaultPath?: string;

  /**
   * Callback after redirect starts
   */
  onRedirect?: (path: string) => void;
}

/**
 * Custom hook to handle safe redirection based on query param.
 *
 * Usage:
 * const handleRedirect = useSafeRedirect();
 *
 * @param options - Configuration options
 * @returns { status: string } - Current status for UI
 */
export function useParamBasedRedirect(options: UseSafeRedirectOptions = {}) {
  const {
    paramKey = "redirect",
    defaultPath = "/dashboard",
    onRedirect,
  } = options;

  const searchParams = useSearchParams();
  const router = useRouter();

  const safeRedirect = useCallback(() => {
    const redirect = searchParams.get(paramKey);
    const safePath = getSafeRedirect(redirect, defaultPath);

    onRedirect?.(safePath);
    console.log(safePath);
    router.replace(safePath);
  }, [defaultPath, onRedirect, paramKey, router, searchParams]);

  return safeRedirect;
}
