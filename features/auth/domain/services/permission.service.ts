import { Permission } from "../types/permission.type";

const DEFAULT_TTL_MS = 60_000;

export interface IPermissionService {
	getPermissionsByRoleId(roleId: string): Promise<Permission[]>;
	getCachedPermissionsByRoleId(
		roleId: string,
		ttlMs?: number,
	): Promise<Permission[]>;
	invalidatePermissionsCache(roleId: string): void;
	invalidateAllPermissionsCache(): void;
}

export interface IPermissionServiceDeps {
	fetchPermissionsByRoleId: (roleId: string) => Promise<Permission[]>;
}

export interface ICache<T> {
	get(key: string): { value: T; expiresAt: number } | undefined;
	set(key: string, value: T, expiresAt: number): void;
	delete(key: string): void;
	clear(): void;
}

export interface IAuthServiceBuilder {
	(
		deps: IPermissionServiceDeps,
		cache: ICache<Permission[]>,
		defaultTtlMs?: number,
	): IPermissionService;
}

export const buildPermissionService: IAuthServiceBuilder = (
	deps,
	cache,
	defaultTtlMs = DEFAULT_TTL_MS,
): IPermissionService => ({
	getPermissionsByRoleId: (roleId: string) =>
		deps.fetchPermissionsByRoleId(roleId),

	getCachedPermissionsByRoleId: async (
		roleId: string,
		ttlMs = defaultTtlMs,
	): Promise<Permission[]> => {
		const cached = cache.get(roleId);

		if (cached && cached.expiresAt > Date.now()) {
			return cached.value;
		}

		const permissions = await deps.fetchPermissionsByRoleId(roleId);
		cache.set(roleId, permissions, Date.now() + ttlMs);
		return permissions;
	},

	invalidatePermissionsCache: (roleId: string): void => {
		cache.delete(roleId);
	},

	invalidateAllPermissionsCache: (): void => {
		cache.clear();
	},
});
