import { Middleware } from "../shared/types/middleware.type";
import { buildWithAuthorization } from "./adapters/route/with-authorization/build-with-authorization";
import {
	buildRequireSsrAuth,
	IRequireSsrAuth,
} from "./domain/lib/require-ssr-auth";
import {
	buildRolePermissionRepository,
	IRolePermissionRepository,
} from "./domain/repositories/permission.repository";
import { buildJwtService, IJwtService } from "./domain/services/jwt.service";
import { permissionCacheBuilder } from "./domain/services/permission-cache.service";
import { buildPermissionService } from "./domain/services/permission.service";
import { AuthModuleDeps } from "./domain/types/auth-module-deps.type";
import { Permission } from "./domain/types/permission.type";

export interface IAuthModuleBuilder {
	(params: AuthModuleDeps): IAuthModule;
}

export interface IAuthModule {
	withAuthorization: (requiredPermissions: Permission[]) => Middleware;
	withAuthContext: Middleware;
	requireSsrAuth: IRequireSsrAuth;
	jwtService: IJwtService;
	rolePermissionRepository: IRolePermissionRepository;
}

export const buildAuthModule: IAuthModuleBuilder = (
	params: AuthModuleDeps,
): IAuthModule => {
	const { prismaClient, jwtSecret, cacheTtlMs } = params;

	const jwtService = buildJwtService(jwtSecret);
	const permissionCache = permissionCacheBuilder();
	const rolePermissionRepository =
		buildRolePermissionRepository(prismaClient);
	const permissionService = buildPermissionService(
		{ fetchPermissionsByRoleId: rolePermissionRepository.getByRoleId },
		permissionCache,
		cacheTtlMs,
	);

	const withAuthorization = buildWithAuthorization(
		jwtService,
		permissionService,
	);
	const withAuthContext = withAuthorization([]);
	const requireSsrAuth = buildRequireSsrAuth({
		jwtService,
		getPermissionsByRoleId: permissionService.getPermissionsByRoleId,
	});

	return {
		withAuthorization,
		withAuthContext,
		requireSsrAuth,
		jwtService,
		rolePermissionRepository,
	};
};
