import { resolveAdminAccessTokenCookieName } from "@/features/auth/domain/lib/resolve-admin-access-token-cookie-name";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { permissionService } from "@/features/auth/permission-service";
import { jwtService } from "@/src/application/auth/jwt.service";
import { buildJwtAuthContextResolver } from "@/src/application/auth/resolve-auth-context";
import { UseCaseUnauthorizedError } from "@/src/application/shared/errors/use-case-errors";

export { can } from "./domain/lib/can";
export { hasPermissions } from "./domain/lib/has-permissions";
export { useAuthStore } from "./ui/auth-store";
export { Gate } from "./ui/components/gate";
export { ProtectedRoute } from "./ui/components/protected-route";

export const resolveAuthContext = buildJwtAuthContextResolver(
	jwtService,
	permissionService,
);

type RequireSsrAuthSource = {
	storeSlug?: string;
};

export async function getSsrAccessToken(
	source: RequireSsrAuthSource = {},
): Promise<string | null> {
	const { cookies } = await import("next/headers");
	const cookieStore = await cookies();

	const cookieName = resolveAdminAccessTokenCookieName(
		source,
		cookieStore.getAll().map((cookie) => cookie.name),
	);

	if (!cookieName) return null;

	return cookieStore.get(cookieName)?.value ?? null;
}

export async function requireSsrAuth(
	source: RequireSsrAuthSource = {},
): Promise<AuthContext> {
	const token = await getSsrAccessToken(source);
	const authContext = await resolveAuthContext(token);

	if (!authContext) {
		throw new UseCaseUnauthorizedError("Authentication required");
	}

	return authContext;
}
