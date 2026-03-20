export enum PermissionEnum {
  "items:read" = 0,
  "items:create",
  "items:update",
  "items:delete",
  "categories:read",
  "categories:create",
  "categories:update",
  "categories:delete",
  "roles:read",
  "roles:create",
  "roles:update",
  "roles:delete",
  "admins:read",
  "admins:create",
  "admins:update",
  "admins:delete",
  "store:settings:read",
  "store:settings:update",
}

export type Permission = keyof typeof PermissionEnum;

// Filter keeps only the string keys (ignoring the reverse-mapped numbers)
export const PermissionsArray = Object.keys(PermissionEnum).filter((key) =>
  isNaN(Number(key)),
) as Permission[];
