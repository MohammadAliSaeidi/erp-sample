import { Permission, PermissionEnum } from "../types/permission.type";

// Use these constants in route definitions and tests instead of raw strings.
// Auto-complete works, typos are caught at compile time.
//
// Usage:
//   withAuthorization([PERMISSIONS.ITEMS.CREATE, PERMISSIONS.ITEMS.READ])
//   withAuthorization([PERMISSIONS.ROLES.CREATE])
export const PERMISSIONS = {
	ITEMS: {
		READ: "items:read" as Permission,
		CREATE: "items:create" as Permission,
		UPDATE: "items:update" as Permission,
		DELETE: "items:delete" as Permission,
	},
	CATEGORIES: {
		READ: "categories:read" as Permission,
		CREATE: "categories:create" as Permission,
		UPDATE: "categories:update" as Permission,
		DELETE: "categories:delete" as Permission,
	},
	ROLES: {
		READ: "roles:read" as Permission,
		CREATE: "roles:create" as Permission,
		UPDATE: "roles:update" as Permission,
		DELETE: "roles:delete" as Permission,
	},
	ADMINS: {
		READ: "admins:read" as Permission,
		CREATE: "admins:create" as Permission,
		UPDATE: "admins:update" as Permission,
		DELETE: "admins:delete" as Permission,
	},
	STORE_SETTINGS: {
		READ: "store:settings:read" as Permission,
		UPDATE: "store:settings:update" as Permission,
	},
} as const;

// ─── All Permissions List ─────────────────────────────────────────────────────
// Flat list of every permission. Used to seed the DB and for super-admin roles.

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS).flatMap(
  (group) => Object.values(group) as Permission[],
);
