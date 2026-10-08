"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type UseStateInUrlProps = {
  stateName: string;
  defaultValue?: string;
};

export function useStateInUrl({ stateName, defaultValue }: UseStateInUrlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = useMemo(() => {
    const param = searchParams.get(stateName);
    return param !== null ? param : defaultValue;
  }, [searchParams, stateName, defaultValue]);

  const setValue = useCallback(
    (newValue: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newValue !== undefined && newValue !== "") {
        params.set(stateName, newValue);
      } else {
        params.delete(stateName);
      }
      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(url, { scroll: false });
    },
    [router, pathname, searchParams, stateName],
  );

  return [value, setValue] as const;
}
