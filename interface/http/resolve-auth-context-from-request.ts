import { resolveAuthContext } from "@/features/auth";
import { resolveCookieNameFromRequest } from "@/features/auth/adapters/route/with-authorization/resolve-cookie-name-from-request";
import type { NextRequest } from "next/server";

/**
 * Single entry point for API Route Handlers: same JWT + permission loading as SSR,
 * using the request’s cookies and store slug (headers / referer).
 */
export async function resolveAuthContextFromRequest(request: NextRequest) {
  const cookieName = resolveCookieNameFromRequest(request);

  const token = cookieName
    ? (request.cookies.get(cookieName)?.value ?? null)
    : null;

  return resolveAuthContext(token);
}
