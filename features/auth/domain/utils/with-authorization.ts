import type { NextRequest } from "next/server";
import { ApiHandler } from "../types/api-handler.type";
import { AuthContext } from "../types/auth-context.type";
import { Permission } from "../types/permission.type";
import { hasPermissions } from "./has-permissions";
import { IPermissionService } from "../services/permission.service";
import { IJwtService } from "../services/jwt.service";

/**
 * Factory function that creates an authorization middleware for Next.js API routes.
 *
 * @description
 * This function implements a curried, dependency-injected authorization middleware
 * for protecting Next.js API routes. It follows a factory pattern where dependencies
 * are injected once and the resulting middleware can be reused across multiple routes.
 *
 * The middleware performs three critical tasks in order:
 * 1. Extracts and verifies JWT from the request
 * 2. Resolves role-based permissions from the database
 * 3. Validates the user has all required permissions
 *
 * If successful, it enriches the handler with a complete auth context containing
 * user identity, role, and resolved permissions — eliminating the need for handlers
 * to re-fetch or re-validate authentication data.
 *
 * @param {IJwtService} jwtService - Service for JWT operations (extraction, verification)
 * @param {IPermissionService} permissionService - Service for resolving role-based permissions
 *
 * @returns {Function} A curried middleware generator that accepts required permissions
 *                     and returns a route handler wrapper
 *
 * @example
 * // Step 1: Create the middleware with injected dependencies
 * const withAuthorization = makeWithAuthorization(jwtService, permissionService);
 *
 * @example
 * // Step 2: Define a protected GET endpoint
 * export const GET = withAuthorization([PERMISSIONS.ITEMS.READ])(
 *   async (req, ctx, auth) => {
 *     // auth contains: { adminId, storeId, roleId, permissions }
 *     const items = await getItemsForStore(auth.storeId);
 *     return Response.json(items);
 *   }
 * );
 *
 * @example
 * // Protected route requiring multiple permissions
 * export const POST = withAuthorization([PERMISSIONS.ITEMS.CREATE, PERMISSIONS.INVENTORY.MANAGE])(
 *   async (req, ctx, auth) => {
 *     const body = await req.json();
 *     // Auth context already verified user has ALL required permissions
 *     return createItem({ ...body, storeId: auth.storeId });
 *   }
 * );
 *
 * @example
 * // Error responses
 * // 401 Unauthorized - Missing or invalid JWT
 * // 403 Forbidden - Valid JWT but insufficient permissions
 *
 * @throws {Error} May throw if jwtService or permissionService methods fail
 *
 * @see {@link hasPermissions} - The underlying permission checking function
 * @see {@link AuthContext} - The auth context provided to handlers
 * @see {@link ApiHandler} - The handler type signature
 */
export const makeWithAuthorization = (
	jwtService: IJwtService,
	permissionService: IPermissionService,
) => {
	return (required: Permission[]) => {
		return <TContext>(handler: ApiHandler<TContext>) => {
			return async (
				req: NextRequest,
				ctx: TContext,
			): Promise<Response> => {
				const jwtPayload = await jwtService.extractFromRequest(req);

				if (!jwtPayload) {
					return Response.json(
						{
							error: "Unauthorized",
							message: "Missing or invalid token",
						},
						{ status: 401 },
					);
				}

				const permissions =
					await permissionService.getPermissionsByRoleId(
						jwtPayload.roleId,
					);

				// 3. Check required permissions
				if (!hasPermissions(permissions, required)) {
					return Response.json(
						{
							error: "Forbidden",
							message: "You don't have permission to perform this action",
						},
						{ status: 403 },
					);
				}

				// 4. Build auth context and delegate to the handler
				// The handler gets everything it needs — never has to re-fetch auth info.
				const auth: AuthContext = {
					adminId: jwtPayload.adminId,
					storeId: jwtPayload.storeId,
					roleId: jwtPayload.roleId,
					permissions,
				};

				return handler(req, ctx, auth);
			};
		};
	};
};
