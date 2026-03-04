import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
// import { setStoreSlugInCookieProxy } from "./proxies/setStoreSlugInCookieProxy";

export function proxy(request: NextRequest) {
  // setStoreSlugInCookieProxy(request);

  return NextResponse.next();
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
