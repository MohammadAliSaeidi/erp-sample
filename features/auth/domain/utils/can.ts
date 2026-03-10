import { Permission } from "../types/permission.type";

/**
 * Checks if a user has the required permissions.
 *
 * @description
 * A pure function that validates whether the user's permission set satisfies
 * the required permission(s). This is a synchronous, side-effect free check
 * that simply performs array inclusion tests. It's the frontend equivalent
 * of the backend's hasPermissions function.
 *
 * Use this function directly in components and hooks for permission-based
 * UI logic (e.g., conditional rendering, feature access). Never use it for
 * actual authorization enforcement on the backend side.
 *
 * @param {Permission[]} userPermissions - Array of permissions granted to the user
 * @param {Permission | Permission[]} required - Single permission or array of permissions required.
 *                                               When an array is provided, ALL permissions must be satisfied.
 *
 * @returns {boolean} - True if the user has ALL required permissions, false otherwise
 *
 * @example
 * // Check single permission
 * const canCreate = can(userPermissions, "items:create");
 *
 * @example
 * // Check multiple permissions (ALL required)
 * const canManageItems = can(userPermissions, ["items:create", "items:read", "items:update"]);
 *
 * @example
 * // Use in conditional rendering
 * {can(userPermissions, "admin:access") && <AdminPanel />}
 *
 * @example
 * // Use in hook logic
 * useEffect(() => {
 *   if (can(userPermissions, "settings:edit")) {
 *     enableEditMode();
 *   }
 * }, [userPermissions]);
 */
export const can = (
	userPermissions: Permission[],
	required: Permission | Permission[],
): boolean => {
	const requirements = Array.isArray(required) ? required : [required];
	return requirements.every((p) => userPermissions.includes(p));
};
