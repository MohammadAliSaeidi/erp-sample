import { resolveAuthContext } from "@/features/auth/domain/lib/resolve-auth-context";
import { Middleware } from "@/features/shared/types/middleware.type";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import type { NextRequest } from "next/server";
import { ForbiddenError } from "../../../domain/errors/forbidden.error";
import { UnauthorizedError } from "../../../domain/errors/unauthorized.error";
import { IJwtService } from "../../../domain/services/jwt.service";
import { IPermissionService } from "../../../domain/services/permission.service";
import { Permission } from "../../../domain/types/permission.type";
import { resolveCookieNameFromRequest } from "./resolve-cookie-name-from-request";

const unauthorizedResponse = () =>
	Response.json(
		{
			error: "Unauthorized",
			message: "Missing or invalid token",
		},
		{ status: 401 },
	);

const forbiddenResponse = () =>
	Response.json(
		{
			error: "Forbidden",
			message: "You don't have permission to perform this action",
		},
		{ status: 403 },
	);

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
				try {
					const authContext = await resolveAuthContext({
						requiredPermissions,
						getToken: async () => {
							const cookieName =
								resolveCookieNameFromRequest(request);
							if (!cookieName) return null;
							return (
								request.cookies.get(cookieName)?.value ??
								null
							);
						},
						getPermissionsByRoleId:
							permissionService.getPermissionsByRoleId,
						jwtService,
					});
					const requestWithAuthContext = Object.assign(request, {
						authContext,
					});
					return handler(requestWithAuthContext, context);
				} catch (error) {
					if (error instanceof UnauthorizedError) {
						return unauthorizedResponse();
					}

					if (error instanceof ForbiddenError) {
						return forbiddenResponse();
					}

					throw error;
				}
			};
		};
	};
};
