import { useIsHydrated } from "./use-is-hydrated";

/**
 * just exactly like the useIsHydrated but with a different name
 * @returns {boolean} `true` after the component has hydrated (which means it is running on clients browser), `false` otherwise.
 *
 * @example
 * const isHydrated = useIsHydrated();
 * if (isHydrated) {
 *   // Safe to run client-side effects
 * }
 */
export function useIsClient() {
  const isHydrated = useIsHydrated();

  return isHydrated;
}
