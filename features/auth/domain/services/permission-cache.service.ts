import { Permission } from "../types/permission.type";
import { ICache } from "./permission.service";

export const permissionCacheBuilder = (): ICache<Permission[]> => {
	const cacheMap = new Map<
		string,
		{ permissions: Permission[]; expiresAt: number }
	>();

	return {
		set: (key: string, value: Permission[], expiresAt: number) => {
			cacheMap.set(key, {
				expiresAt,
				permissions: value,
			});
		},

		clear: () => cacheMap.clear(),

		delete: (key: string) => cacheMap.delete(key),

		get: (key: string) => {
			const cachedPermission = cacheMap.get(key);

			if (!cachedPermission) return undefined;

			return {
				expiresAt: cachedPermission.expiresAt,
				value: cachedPermission.permissions,
			};
		},
	};
};
