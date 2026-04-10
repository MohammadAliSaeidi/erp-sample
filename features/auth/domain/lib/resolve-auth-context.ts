import { authorize } from "@/features/auth/domain/authorize";
import { IJwtService } from "@/features/auth/domain/services/jwt.service";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { Permission } from "@/features/auth/domain/types/permission.type";

export interface ResolveAuthContextInput {
	requiredPermissions: Permission[];
	getToken: () => Promise<string | null>;
	getPermissionsByRoleId: (roleId: string) => Promise<Permission[]>;
	jwtService: Pick<IJwtService, "verify">;
}

export async function resolveAuthContext(
	input: ResolveAuthContextInput,
): Promise<AuthContext> {
	const authorizeRequest = authorize({
		getToken: input.getToken,
		getPermissions: input.getPermissionsByRoleId,
		jwtService: input.jwtService,
	});

	return authorizeRequest(input.requiredPermissions);
}
