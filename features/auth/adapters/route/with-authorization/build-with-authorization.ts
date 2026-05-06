import { ResolveAuthContext } from "@/application/auth/resolve-auth-context";
import { Middleware } from "@/features/shared/types/middleware.type";
import type { NextRequest } from "next/server";
import { Permission } from "../../../domain/types/permission.type";
import { resolveCookieNameFromRequest } from "./resolve-cookie-name-from-request";
import { resolveStoreSlugFromRequest } from "./resolve-store-slug-from-request";

/**
 * Route middleware: resolves auth context and attaches `authContext` to the request.
 * Permission checks are enforced in `runUseCase` only; `requiredPermissions` is kept
 * for API compatibility but intentionally unused.
 */
export const buildWithAuthorization = (
	resolveAuthContext: ResolveAuthContext,
) => {
	return (_unused: Permission[]): Middleware => {
		return <TContext = unknown>(handler: RouteHandler<TContext>) => {
			return async (
				request: NextRequest,
				context: TContext,
			): Promise<Response> => {
				const storeSlug = resolveStoreSlugFromRequest(request) ?? undefined;
				const cookieName = resolveCookieNameFromRequest(request);
				const token =
					cookieName !== null
						? (request.cookies.get(cookieName)?.value ?? null)
						: null;
				const authContext = await resolveAuthContext({ storeSlug, token });
				const requestWithAuthContext = Object.assign(request, {
					authContext,
				});
				return handler(requestWithAuthContext, context);
			};
		};
	};
};
