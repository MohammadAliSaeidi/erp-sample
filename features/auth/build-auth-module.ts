import {
	buildRequireSsrAuth,
	RequireSsrAuth,
} from "@/application/auth/required-ssr-auth";
import {
	buildResolveAuthContext,
	ResolveAuthContext,
} from "@/application/auth/resolve-auth-context";
import { Middleware } from "../shared/types/middleware.type";
import { buildWithAuthorization } from "./adapters/route/with-authorization/build-with-authorization";
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
	resolveAuthContext: ResolveAuthContext;
	requireSsrAuth: RequireSsrAuth;
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

	const resolveAuthContext = buildResolveAuthContext({
		jwtService,
		getPermissionsByRoleId: permissionService.getPermissionsByRoleId,
	});

	const requireSsrAuth = buildRequireSsrAuth(resolveAuthContext);

	const withAuthorization = buildWithAuthorization(resolveAuthContext);

	return {
		withAuthorization,
		resolveAuthContext,
		requireSsrAuth,
		jwtService,
		rolePermissionRepository,
	};
};
