import { resolveAdminAccessTokenCookieName } from "@/features/auth/domain/lib/resolve-admin-access-token-cookie-name";
import { adminAuthContextSchema } from "@/features/auth/domain/schemas/auth-context.schema";
import { IJwtService } from "@/features/auth/domain/services/jwt.service";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { Permission } from "@/features/auth/domain/types/permission.type";

export interface AuthContextSource {
  storeSlug?: string;
  token?: string | null;
  cookieNames?: string[];
}

export interface IBuildAuthContextResolverDeps {
  jwtService: Pick<IJwtService, "verify">;
  getPermissionsByRoleId: (roleId: string) => Promise<Permission[]>;
  getToken?: (source: AuthContextSource) => Promise<string | null>;
}

export type ResolveAuthContext = (
  source?: AuthContextSource,
) => Promise<AuthContext | null>;

const defaultGetToken = async (
  source: AuthContextSource,
): Promise<string | null> => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  const cookieName = resolveAdminAccessTokenCookieName(
    source,
    cookieStore.getAll().map((c) => c.name),
  );
  if (!cookieName) return null;

  return cookieStore.get(cookieName)?.value ?? null;
};

export const buildResolveAuthContext =
  (deps: IBuildAuthContextResolverDeps): ResolveAuthContext =>
  async (source: AuthContextSource = {}) => {
    const getToken = deps.getToken ?? defaultGetToken;
    const token = source.token ?? (await getToken(source));
    if (!token) return null;

    const raw = await deps.jwtService.verify(token);
    if (!raw) return null;

    const parsed = adminAuthContextSchema.safeParse(raw);
    if (!parsed.success) return null;

    const payload = parsed.data;
    if (payload.grantsAll) {
      return { ...payload, permissions: [] as Permission[] };
    }

    const permissions = await deps.getPermissionsByRoleId(payload.roleId);
    return { ...payload, permissions };
  };
