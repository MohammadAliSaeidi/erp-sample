"use server";

import {
	DEFAULT_LOCALE,
	LOCALE_COOKIE,
} from "@/lib/i18n/config";
import { cookies } from "next/headers";

/**
 * Persists the active locale. Call from the client, then `router.refresh()`
 * so the root layout re-reads the cookie and updates `lang` / `dir` on `<html>`.
 */
export async function setLocale(locale: string) {
	const value = locale.trim() || DEFAULT_LOCALE;
	const jar = await cookies();
	jar.set(LOCALE_COOKIE, value, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
		sameSite: "lax",
	});
}
