import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { resolveAdminAccessTokenCookieName } from "./features/auth/domain/lib/resolve-admin-access-token-cookie-name";
import { buildJwtService } from "./features/auth/domain/services/jwt.service";
import { getStoreSlugFromPath } from "./features/shared/lib/utils/get-store-slug-from-path";

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  if (request.nextUrl.pathname.startsWith("/store")) {
    const storeSlug = getStoreSlugFromPath(request.nextUrl.pathname)

    if (storeSlug) {
      if (
        request.nextUrl.pathname.startsWith(`/store/${storeSlug}/admin/login`)
      ) {
        return NextResponse.next({ request: { headers: requestHeaders } });
      } else if (
        request.nextUrl.pathname.startsWith(`/store/${storeSlug}/admin`)
      ) {
        const cookieStore = await cookies();
        const cookieName = resolveAdminAccessTokenCookieName(
          { storeSlug },
          cookieStore.getAll().map((cookie) => cookie.name),
        );

        if (!cookieName) {
          return NextResponse.redirect(
            new URL(`/store/${storeSlug}/admin/login`, request.url),
          );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const jwtService = buildJwtService(secret);
        const payload = await jwtService.extractFromRequest(
          request,
          cookieName,
        );

        if (!payload) {
          return NextResponse.redirect(
            new URL(`/store/${storeSlug}/admin/login`, request.url),
          );
        }

        const now = Date.now()
        const isExpired = payload.exp && payload.exp < (now / 1000);
        const isInvalidStoreSlug = payload.storeSlug !== storeSlug;

        if (isExpired || isInvalidStoreSlug) {
          return NextResponse.redirect(
            new URL(`/store/${storeSlug}/admin/login`, request.url),
          );
        }

        return NextResponse.next({ request: { headers: requestHeaders } });
      }
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public-page (your custom excluded path)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public-page).*)",
  ],
};
