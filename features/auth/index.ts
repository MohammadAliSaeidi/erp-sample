export { can } from "./domain/lib/can";
export { hasPermissions } from "./domain/lib/has-permissions";
export { useAuthStore } from "./ui/auth-store";
export { Gate } from "./ui/components/gate";
export { ProtectedRoute } from "./ui/components/protected-route";
import { buildAuthModule } from "@/features/auth/build-auth-module";
import prisma from "@/features/shared/lib/prisma";

/**
 * Authentication Dependency Injection Module
 *
 * Centralized dependency container that wires together all authentication-related
 * services and utilities. This module follows the singleton pattern and is instantiated
 * once per process lifecycle.
 *
 * @property {function} withAuthorization - Middleware/handler wrapper for authorization checks
 * @property {object} jwtService - JWT token operations service
 * @property {object} rolePermissionRepo - Role-permission repository with caching layer
 *
 * @param {object} config - Module configuration
 * @param {import('@prisma/client').PrismaClient} config.prisma - Prisma client instance
 * @param {string} config.jwtSecret - Secret key for JWT signing and verification
 * @param {number} config.cacheTtlMs - Cache TTL in milliseconds (default: 60_000). Adjust based on
 *   your data consistency requirements vs performance needs
 *
 * @returns {{withAuthorization, jwtService, rolePermissionRepo}} Destructured auth utilities
 *
 * @example
 * // In route handlers:
 * import { withAuthorization } from "@/lib/di"
 *
 * @example
 * // After updating role permissions:
 * rolePermissionRepo.invalidate(roleId)
 *
 * @remarks
 * **Cache Invalidation**: The `rolePermissionRepo` maintains an internal cache for performance.
 * You must call `.invalidate(roleId)` after any role permission modifications to prevent stale
 * authorization decisions.
 *
 * @module lib/di
 */
export const {
	withAuthorization,
	withAuthContext,
	requireSsrAuth,
	jwtService,
	rolePermissionRepository,
} = buildAuthModule({
	prismaClient: prisma,
	jwtSecret: new TextEncoder().encode(process.env.JWT_SECRET!),
	cacheTtlMs: 60_000,
});
