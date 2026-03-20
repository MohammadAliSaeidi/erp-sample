import "server-only";
import { redirect, RedirectType } from "next/navigation";
import { headers } from "next/headers";
import { resolveLoginUrl } from "../login-url-resolver";
import type { RedirectHandler } from "../types";

export class ServerRedirectHandler implements RedirectHandler {
	async redirectToLogin(): Promise<void> {
		const currentPath = await this.resolveCurrentPath();
		const loginUrl = resolveLoginUrl(currentPath);

		if (currentPath === loginUrl) return;

		redirect(loginUrl, RedirectType.replace);
	}

	private async resolveCurrentPath(): Promise<string> {
		const headersList = await headers();
		// this header has been set (must be, if has not been yet) in the proxy (middleware)
		return headersList.get("x-pathname") ?? "/";
	}
}
