import { withValidatedBody } from "@/app/api/_middlewares/validate-body";
import { ADMIN_ACCESS_TOKEN_COOKIE_NAME } from "@/constants/token-names";
import { loginBodySchema } from "@/features/auth/domain/schemas/login-body.schema";
import prisma from "@/lib/prisma";
import { setTokenCookie } from "@/lib/token";
import { isHashMatch } from "@/lib/utils/hash/hash";
import { AdminAccessTokenPayload } from "@/types/admin-access-token-payload";
import { NextResponse } from "next/server";

export const POST = withValidatedBody(loginBodySchema, async (req, _, body) => {
  const referer = req.headers.get("referer");

  if (!referer)
    return NextResponse.json(null, {
      status: 400,
      statusText: "Request header referer is missing",
    });

  let pathname: string;
  try {
    pathname = new URL(referer).pathname;
  } catch {
    return NextResponse.json(null, {
      status: 400,
      statusText: "Request header referer is invalid",
    });
  }

  const pathnameSegments = pathname.split("/").filter(Boolean);
  const storeRouteIndex = pathnameSegments.findIndex(
    (segment) => segment === "store",
  );
  const storeSlug =
    storeRouteIndex >= 0 ? pathnameSegments[storeRouteIndex + 1] : undefined;

  if (!storeSlug) {
    return NextResponse.json(null, {
      status: 400,
      statusText: "Store slug was not found in referer",
    });
  }

  const store = await prisma.store.findUnique({
    where: {
      slug: storeSlug,
    },
  });

  if (!store)
    return NextResponse.json(null, {
      status: 404,
      statusText: "Store Not Found",
    });

  const storeUser = await prisma.storeUser.findUnique({
    where: {
      storeId_username: {
        storeId: store.id,
        username: body.username,
      },
    },
  });

  const isValidCredentials =
    storeUser && (await isHashMatch(body.password, storeUser.password));

  if (!isValidCredentials) {
    return NextResponse.json(
      {},
      { status: 401, statusText: "Incorrect username or password" },
    );
  }

  const cookieName = ADMIN_ACCESS_TOKEN_COOKIE_NAME(storeSlug);

  await setTokenCookie<AdminAccessTokenPayload>(cookieName, {
    sub: storeUser.id,
    name: storeUser.name,
    storeId: storeUser.storeId,
    username: storeUser.username,
  });

  // const cookieStore = await cookies();
  // cookieStore.set(STORE_SLUG_COOKIE_NAME, storeSlug);

  return NextResponse.json(null, {
    status: 200,
    statusText: "logged in successfully",
  });
});
