import { ADMIN_ACCESS_TOKEN_COOKIE_NAME } from "@/constants/token-names";
import { getStoreSlugFromPath } from "@/features/shared/lib/utils/get-store-slug-from-path";
import { Middleware } from "@/features/shared/types/middleware.type";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import type { NextRequest } from "next/server";
import { IJwtService } from "../services/jwt.service";
import { IPermissionService } from "../services/permission.service";
import { AuthContext } from "../types/auth-context.type";
import { Permission } from "../types/permission.type";
import { hasPermissions } from "./has-permissions";

/**
 * Factory function that creates an authorization middleware for Next.js API routes.
 *
 * @description
 * This factory implements a dependency-injected middleware pattern for protecting
 * Next.js API routes. It creates a reusable authorization layer that validates
 * JWT tokens, resolves permissions, and enforces access control.
 *
 * ## Core Flow
 * The middleware executes three sequential operations:
 * 1. **JWT Extraction**: Retrieves and verifies JWT from request using appropriate cookie name
 * 2. **Permission Resolution**: Fetches role-based permissions from the database
 * 3. **Access Validation**: Verifies user has ALL required permissions
 *
 * ## Store Context Resolution
 * The middleware determines the store context in the following priority:
 * 1. **JWT Payload**: Uses `storeSlug` from verified token (highest priority)
 * 2. **Request Header**: Falls back to `x-store-slug` header
 * 3. **Referer URL**: Last resort - extracts from referer path
 *
 * ## Cookie Name Resolution
 * Admin access tokens are store-specific. The cookie name is resolved by:
 * 1. Using the resolved store slug to construct `ADMIN_ACCESS_TOKEN_COOKIE_NAME(storeSlug)`
 * 2. If no store slug is resolvable, attempts to find a single matching admin cookie
 *
 * @param {IJwtService} jwtService - Service for JWT extraction and verification
 * @param {IPermissionService} permissionService - Service for resolving role-based permissions
 * @returns {Function} Curried middleware generator expecting required permissions array
 *
 * @example
 * // Create the middleware with injected dependencies
 * const withAuthorization = buildWithAuthorization(jwtService, permissionService);
 *
 * // Protect a GET endpoint
 * export const GET = withAuthorization([PERMISSIONS.ITEMS.READ])(
 *   async (request, context) => {
 *     // Auth context is attached to the request object
 *     const { adminId, storeId, username, permissions } = request;
 *
 *     const items = await getItemsForStore(storeId);
 *     return Response.json(items);
 *   }
 * );
 *
 * @example
 * // Protect a POST endpoint requiring multiple permissions
 * export const POST = withAuthorization([PERMISSIONS.ITEMS.CREATE, PERMISSIONS.INVENTORY.MANAGE])(
 *   async (request, context) => {
 *     const body = await request.json();
 *
 *     // Auth context available directly on request
 *     return createItem({ ...body, storeId: request.storeId });
 *   }
 * );
 *
 * @example
 * // With custom route context
 * interface RouteContext { params: { id: string } }
 *
 * export const DELETE = withAuthorization([PERMISSIONS.ITEMS.DELETE])<RouteContext>(
 *   async (request, context) => {
 *     const { id } = context.params;
 *     await deleteItem(id, request.storeId);
 *     return new Response(null, { status: 204 });
 *   }
 * );
 *
 * ## Error Responses
 *
 * | Status | Condition | Response Body |
 * |--------|-----------|---------------|
 * | 401 | Missing or invalid JWT | `{ error: "Unauthorized", message: "Missing or invalid token" }` |
 * | 401 | Invalid token payload | `{ error: "Unauthorized", message: "Invalid token payload" }` |
 * | 403 | Insufficient permissions | `{ error: "Forbidden", message: "You don't have permission to perform this action" }` |
 *
 * ## Auth Context Properties
 * The following properties are attached to the request object upon successful authorization:
 * - `adminId: string` - Authenticated admin's ID
 * - `storeId: string` - Store ID from JWT
 * - `storeSlug: string` - Resolved store slug
 * - `username: string` - Admin's username
 * - `roleId: string` - Role ID for permission resolution
 * - `permissions: Permission[]` - Complete list of user's permissions
 *
 * ## Type Safety
 * ```typescript
 * // Request type is augmented with auth context
 * const handler = withAuthorization([PERMISSIONS.READ])(
 *   async (req: NextRequest & AuthContext, context) => {
 *     // req has all auth properties
 *   }
 * );
 * ```
 *
 * @throws {Error} May throw if jwtService or permissionService methods fail
 *
 * @see {@link hasPermissions} - Core permission checking logic
 * @see {@link AuthContext} - Auth context type definition
 * @see {@link Permission} - Available permission types
 */
export const buildWithAuthorization = (
	jwtService: IJwtService,
	permissionService: IPermissionService,
) => {
	return (requiredPermissions: Permission[]): Middleware => {
		return <TContext = unknown>(handler: RouteHandler<TContext>) => {
			return async (
				request: NextRequest,
				context: TContext,
			): Promise<Response> => {
				const cookieName =
					resolveCookieNameFromRequest(request) ?? undefined;

				const jwtPayload = await jwtService.extractFromRequest(
					request,
					cookieName,
				);

				if (!jwtPayload) {
					return Response.json(
						{
							error: "Unauthorized",
							message: "Missing or invalid token",
						},
						{ status: 401 },
					);
				}

				const storeSlugFromRequest =
					resolveStoreSlugFromRequest(request);

				const storeSlugFromJWTPayload = jwtPayload.storeSlug;

				const storeSlug =
					storeSlugFromJWTPayload ?? storeSlugFromRequest;

				if (!storeSlug || !jwtPayload.username) {
					return Response.json(
						{
							error: "Unauthorized",
							message: "Invalid token payload",
						},
						{ status: 401 },
					);
				}

				const permissions =
					await permissionService.getPermissionsByRoleId(
						jwtPayload.roleId,
					);

				if (!hasPermissions(permissions, requiredPermissions)) {
					return Response.json(
						{
							error: "Forbidden",
							message: "You don't have permission to perform this action",
						},
						{ status: 403 },
					);
				}

				const authContext: AuthContext = {
					adminId: jwtPayload.adminId,
					storeId: jwtPayload.storeId,
					storeSlug,
					username: jwtPayload.username,
					roleId: jwtPayload.roleId,
					permissions,
				};

				const requestWithAuthContext = Object.assign(request, {
					authContext,
				});

				console.log("requestWithAuthContext", authContext);

				return handler(requestWithAuthContext, context);
			};
		};
	};
};

const resolveStoreSlugFromRequest = (req: NextRequest): string | null => {
	const headerSlug = req.headers?.get?.("x-store-slug")?.trim();
	if (headerSlug) return headerSlug;

	const referer = req.headers?.get?.("referer");
	if (!referer) return null;

	return getStoreSlugFromPath(referer);
};

const resolveCookieNameFromRequest = (req: NextRequest): string | null => {
	const storeSlug = resolveStoreSlugFromRequest(req);
	if (storeSlug) return ADMIN_ACCESS_TOKEN_COOKIE_NAME(storeSlug);

	const cookies = req.cookies?.getAll?.() ?? [];
	const matches = cookies.filter((cookie) =>
		cookie.name.startsWith("ADMIN_ACCESS_TOKEN_COOKIE_"),
	);

	if (matches.length === 1) return matches[0].name;
	return null;
};
