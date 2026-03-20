import type { PrismaClient } from "@/app/generated/prisma/client";
import { rolePermissionRepositoryBuilder } from "./domain/repositories/permission.repository";
import { buildJwtService } from "./domain/services/jwt.service";
import { permissionCacheBuilder } from "./domain/services/permission-cache.service";
import { buildPermissionService } from "./domain/services/permission.service";
import { buildWithAuthorization } from "./domain/utils/with-authorization";

type AuthModuleDeps = {
	prismaClient: PrismaClient;
	jwtSecret: Uint8Array;
	cacheTtlMs?: number;
};

export const createAuthModule = (params: AuthModuleDeps) => {
	const { prismaClient, jwtSecret, cacheTtlMs } = params;

	const jwtService = buildJwtService(jwtSecret);
	const permissionCache = permissionCacheBuilder();
	const permissionRepository = rolePermissionRepositoryBuilder(prismaClient);
	const permissionService = buildPermissionService(
		{ fetchPermissionsByRoleId: permissionRepository.getByRoleId },
		permissionCache,
		cacheTtlMs,
	);

	const withAuthorization = buildWithAuthorization(
		jwtService,
		permissionService,
	);

	return {
		withAuthorization,
		jwtService,
		permissionRepository,
	};
};

export { can } from "./domain/utils/can";
export { hasPermissions } from "./domain/utils/has-permissions";
export { useAuthStore } from "./ui/auth-store";
export { Gate } from "./ui/components/gate";
export { ProtectedRoute } from "./ui/components/protected-route";
