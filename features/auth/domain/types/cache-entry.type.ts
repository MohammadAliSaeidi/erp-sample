import { Permission } from "./permission.type";

export type CacheEntry = {
	permissions: Permission[];
	expiresAt: number;
};
