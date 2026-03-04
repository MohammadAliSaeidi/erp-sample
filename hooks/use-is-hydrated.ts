"use client";

import { useEffect, useState } from "react";

/**
 * Custom React hook to detect if the component has hydrated on the client side.
 *
 * This hook helps avoid hydration mismatches in Next.js or SSR environments
 * by ensuring client-side effects only run after hydration is complete.
 *
 * @returns {boolean} `true` after the component has hydrated, `false` otherwise.
 *
 * @example
 * const isHydrated = useIsHydrated();
 * if (isHydrated) {
 *   // Safe to run client-side effects
 * }
 */
export const useIsHydrated = (): boolean => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  return isHydrated;
};
