export const LOCALE_COOKIE = "locale";

export const DEFAULT_LOCALE = "en";

/** BCP 47 base language subtags that use right-to-left script. Extend as needed. */
export const RTL_LOCALES = new Set([
	"ar",
	"arc",
	"ckb",
	"dv",
	"fa",
	"ha",
	"he",
	"khw",
	"ks",
	"ku",
	"ps",
	"sd",
	"ug",
	"ur",
	"yi",
]);

export function getTextDirection(locale: string): "ltr" | "rtl" {
	const base = locale.toLowerCase().split(/[-_]/)[0];
	return RTL_LOCALES.has(base) ? "rtl" : "ltr";
}
