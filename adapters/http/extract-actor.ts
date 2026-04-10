import { StoreUserId } from "@/features/admin/domain/StoreUser";
import { Actor, RoleId } from "@/features/auth/domain/actor";
import { resolveAdminAccessTokenCookieName } from "@/features/auth/domain/lib/resolve-admin-access-token-cookie-name";
import { UnauthenticatedError } from "@/features/auth/domain/errors/unauthenticated.error";
import { IJwtService } from "@/features/auth/domain/services/jwt.service";
import { cookies } from "next/headers";

export interface ExtractActorContextSource {
	storeSlug?: string;
	cookieName?: string;
}

// Returns null for unauthenticated — does NOT throw.
// The use-case decides whether null is acceptable for its operation.
export const extractActorFromCookie = async (
  jwtService: IJwtService,
  contextSource: ExtractActorContextSource = {},
): Promise<Actor | null> => {
  const cookieStore = await cookies();
  const cookieName = resolveAdminAccessTokenCookieName(
    contextSource,
    cookieStore.getAll().map((cookie) => cookie.name),
  );
  if (!cookieName) return null;

  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;

  const payload = (await jwtService.verify(token)) as Record<
    string,
    unknown
  > | null;

  if (!payload) return null;
  if (typeof payload.roleId !== "string") return null;

  const rawStoreUserId =
    payload.storeUserId ?? payload.adminId ?? payload.sub;
  if (typeof rawStoreUserId !== "string") return null;

  return {
    storeUserId: StoreUserId.parse(rawStoreUserId),
    roleId: RoleId.parse(payload.roleId),
  };
};

// Throws UNAUTHENTICATED immediately — optimization for routes where
// we know unauthenticated actors will always be rejected anyway.
// The use-case still calls authorize() — this is just an early exit.
export const extractActorOrThrow = async (
  jwtService: IJwtService,
  contextSource: ExtractActorContextSource = {},
): Promise<Actor> => {
  const actor = await extractActorFromCookie(jwtService, contextSource);
  if (!actor) throw new UnauthenticatedError();
  return actor;
};
