import "client-only";
import { resolveLoginUrl } from "../login-url-resolver";
import type { RedirectHandler } from "../types";

export class ClientRedirectHandler implements RedirectHandler {
  async redirectToLogin(): Promise<void> {
    const currentPath = window.location.pathname;
    const loginUrl = resolveLoginUrl(currentPath);

    if (currentPath === loginUrl) return;

    window.location.replace(loginUrl);
  }
}
