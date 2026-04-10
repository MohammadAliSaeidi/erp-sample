import { IJwtService } from "../services/jwt.service";
import { AuthContext } from "../types/auth-context.type";
import { Permission } from "../types/permission.type";
import { resolveAdminAccessTokenCookieName } from "./resolve-admin-access-token-cookie-name";
import { resolveAuthContext } from "./resolve-auth-context";

export interface SsrAuthContextSource {
	storeSlug?: string;
	cookieName?: string;
}

export interface IBuildRequireSsrAuthDeps {
	jwtService: Pick<IJwtService, "verify">;
	getPermissionsByRoleId: (roleId: string) => Promise<Permission[]>;
	getToken?: (contextSource: SsrAuthContextSource) => Promise<string | null>;
}

export interface IRequireSsrAuth {
	(
		requiredPermissions: Permission[],
		contextSource?: SsrAuthContextSource,
	): Promise<AuthContext>;
}

const defaultGetToken = async (
	contextSource: SsrAuthContextSource,
): Promise<string | null> => {
	const { cookies } = await import("next/headers");
	const cookieStore = await cookies();

	const cookieName = resolveAdminAccessTokenCookieName(
		contextSource,
		cookieStore.getAll().map((cookie) => cookie.name),
	);

	if (!cookieName) return null;
	return cookieStore.get(cookieName)?.value ?? null;
};

export const buildRequireSsrAuth = (
	deps: IBuildRequireSsrAuthDeps,
): IRequireSsrAuth => {
	const getToken = deps.getToken ?? defaultGetToken;

	return async (
		requiredPermissions: Permission[],
		contextSource: SsrAuthContextSource = {},
	): Promise<AuthContext> => {
		return resolveAuthContext({
			requiredPermissions,
			getToken: () => getToken(contextSource),
			getPermissionsByRoleId: deps.getPermissionsByRoleId,
			jwtService: deps.jwtService,
		});
	};
};
