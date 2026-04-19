"use client";

import { setLocale } from "@/app/actions/locale";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

/** Updates the locale cookie and refreshes so `<html lang>` and `dir` stay in sync. */
export function useSwitchLocale() {
	const router = useRouter();

	return useCallback(
		async (locale: string) => {
			await setLocale(locale);
			router.refresh();
		},
		[router],
	);
}
