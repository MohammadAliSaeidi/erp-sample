import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface TokenPayload {
  sub: string;
  [key: string]: unknown;
}

export async function encodeToken<T extends TokenPayload>(
  payload: T,
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}

export async function decodeToken<T extends TokenPayload>(
  mode: "server" | "client" = "server",
  cookieName: string,
): Promise<T | null> {
  let token: string | null = null;
  if (mode === "server") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    token = cookieStore.get(cookieName)?.value ?? null;
  } else if (mode === "client" && typeof window !== "undefined") {
    token = (await window.cookieStore.get(cookieName))?.value ?? null;
  }

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as T;
  } catch {
    return null;
  }
}

const ONE_HOUR = 60 * 60;

export async function setTokenCookie<T extends TokenPayload>(
  cookieName: string,
  payload: T,
): Promise<void> {
  // console.log("payload", payload);
  const token = await encodeToken(payload);
  // console.log("token", token);

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_HOUR,
  });
}

export async function clearTokenCookie(cookieName: string): Promise<void> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}
