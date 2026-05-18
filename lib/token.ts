import { SignJWT, jwtVerify } from "jose";
import { brand, Brand } from "@/lib/brand";

/**
 * JWT payload shape.
 */
export interface TokenPayload {
  sub: string;
  [key: string]: unknown;
}

const ONE_HOUR_SECONDS = 60 * 60;

/**
 * Build the JWT secret key.
 */
function buildJwtSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.JWT_SECRET!);
}

/**
 * Sign a JWT using HS256.
 */
async function signJwt<T extends TokenPayload>(
  payload: T,
  secret: Uint8Array,
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}

/**
 * Verify a JWT and return its payload.
 */
async function verifyJwt<T extends TokenPayload>(
  token: string,
  secret: Uint8Array,
): Promise<T> {
  const { payload } = await jwtVerify(token, secret);
  return payload as T;
}

/**
 * Read a cookie value on the server.
 */
async function readServerCookie(cookieName: string): Promise<string | null> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  return store.get(cookieName)?.value ?? null;
}

/**
 * Read a cookie value on the client (if available).
 */
async function readClientCookie(cookieName: string): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const cookie = await window.cookieStore.get(cookieName);
  return cookie?.value ?? null;
}

/**
 * Resolve a cookie value based on runtime mode.
 */
async function readCookie(
  mode: "server" | "client",
  cookieName: string,
): Promise<string | null> {
  return mode === "server"
    ? readServerCookie(cookieName)
    : readClientCookie(cookieName);
}

/**
 * Encode a JWT payload and return a branded token string.
 */
export async function encodeToken<T extends TokenPayload>(
  payload: T,
): Promise<Brand<string, "Token">> {
  const secret = buildJwtSecret();
  const token = await signJwt(payload, secret);
  return brand(token);
}

/**
 * Decode a JWT from cookies and return its payload.
 */
export async function decodeToken<T extends TokenPayload>(
  mode: "server" | "client" = "server",
  cookieName: string,
): Promise<T | null> {
  const token = await readCookie(mode, cookieName);
  if (!token) return null;

  try {
    const secret = buildJwtSecret();
    return await verifyJwt<T>(token, secret);
  } catch {
    return null;
  }
}

/**
 * Set a signed JWT cookie.
 */
export async function setTokenCookie<T extends TokenPayload>(
  cookieName: string,
  payload: T,
): Promise<void> {
  const token = await encodeToken(payload);

  const { cookies } = await import("next/headers");
  const store = await cookies();
  store.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_HOUR_SECONDS,
  });
}

/**
 * Clear a JWT cookie.
 */
export async function clearTokenCookie(cookieName: string): Promise<void> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  store.delete(cookieName);
}
