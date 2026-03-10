import { createAuthModule } from "@/features/auth";
import prisma from "@/lib/prisma";

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
export const { withAuthorization, jwtService, permissionRepository } =
	createAuthModule({
		prismaClient: prisma,
		jwtSecret: process.env.JWT_SECRET! as unknown as Uint8Array,
		cacheTtlMs: 60_000, // 1 minute — tune to your consistency requirements
	});
