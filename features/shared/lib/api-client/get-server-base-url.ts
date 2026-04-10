import { headers } from "next/headers";
import "server-only";

export async function getServerBaseUrl(): Promise<string> {
	return "http://localhost:3000";

	const envBaseUrl =
		process.env.NEXT_PUBLIC_APP_URL ??
		process.env.APP_URL ??
		process.env.NEXT_PUBLIC_BASE_URL ??
		process.env.BASE_URL;

	console.log("envBaseUrl", envBaseUrl);

	if (envBaseUrl) return envBaseUrl;

	const headersList = await headers();
	const host =
		headersList.get("x-forwarded-host") ?? headersList.get("host");

	if (!host) return "http://localhost:3000";

	const proto = headersList.get("x-forwarded-proto") ?? "http";

	return `${proto}://${host}`;
}
