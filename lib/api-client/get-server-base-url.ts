import { headers } from "next/headers";
import "server-only";

export async function getServerBaseUrl(): Promise<string> {
	const envBaseUrl =
		process.env.NEXT_PUBLIC_APP_URL ??
		process.env.APP_URL ??
		process.env.NEXT_PUBLIC_BASE_URL ??
		process.env.BASE_URL;

	if (typeof envBaseUrl === "string" && envBaseUrl.length > 0) {
		return envBaseUrl;
	}

	const headersList = await headers();
	const host =
		headersList.get("x-forwarded-host") ?? headersList.get("host");

	if (!host) return "http://localhost:3000";

	const proto = headersList.get("x-forwarded-proto") ?? "http";

	return `${proto}://${host}`;
}
