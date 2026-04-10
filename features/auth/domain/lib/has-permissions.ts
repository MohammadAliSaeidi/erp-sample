import { Permission } from "../types/permission.type";

/**
 * Checks if a user possesses all required permissions.
 *
 * @description
 * A pure, synchronous function that validates whether the user's permission set
 * contains every permission specified in the required list. This function has
 * no side effects, no external dependencies, and performs simple array inclusion
 * tests, making it highly testable and maintainable.
 *
 * The function follows the principle of "safe default" by requiring ALL permissions
 * to be present. For "any permission" scenarios, it's recommended to pass single
 * permissions to individual withAuthorization calls and compose them at the route
 * level rather than modifying this function's behavior.
 *
 * @param {Permission[]} userPermissions - Array of permissions granted to the current user
 * @param {Permission[]} required - Array of permissions that are required for access.
 *                                  If empty array, access is granted by default.
 *
 * @returns {boolean} - Returns true if:
 *                      - The required array is empty (grant by default), OR
 *                      - The user has ALL permissions listed in the required array
 *                     Returns false if any required permission is missing.
 *
 * @example
 * // Basic usage
 * const userPermissions = ["users:read", "users:write", "posts:read"];
 *
 * // Check for single permission
 * hasPermissions(userPermissions, ["posts:read"]); // true
 *
 * @example
 * // Check for multiple permissions (ALL required)
 * hasPermissions(userPermissions, ["users:read", "users:write"]); // true
 * hasPermissions(userPermissions, ["users:read", "users:delete"]); // false
 *
 * @example
 * // Empty requirements grant access
 * hasPermissions(userPermissions, []); // true
 *
 * @example
 * // Use with higher-order components
 * const withEditUser = withAuthorization(
 *   (userPermissions) => hasPermissions(userPermissions, ["users:edit"])
 * );
 *
 * @see {@link can} - For the frontend equivalent with more flexible input types
 */
export const hasPermissions = (
  userPermissions: Permission[],
  required: Permission[],
): boolean => {
  if (required.length === 0) return true;
  return required.every((p) => userPermissions.includes(p));
};
