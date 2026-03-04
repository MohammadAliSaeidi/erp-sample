import { NextRequest } from "next/server";

export function setStoreSlugInCookieProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("pathname: ", pathname);
}
