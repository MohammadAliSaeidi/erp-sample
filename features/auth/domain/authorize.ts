import { ForbiddenError } from "./errors/forbidden.error";
import { UnauthorizedError } from "./errors/unauthorized.error";
import { hasPermissions } from "./lib/has-permissions";
import { authContextSchema } from "./schemas/auth-context.schema";
import { IJwtService } from "./services/jwt.service";
import { AuthContext } from "./types/auth-context.type";
import { Permission } from "./types/permission.type";

export interface IAuthDeps {
	getToken: () => Promise<string | null>;
	getPermissions: (roleId: string) => Promise<Permission[]>;
	jwtService: Pick<IJwtService, "verify">;
}

const isValidAuthPayload = (
	payload: AuthContext | null,
): payload is Omit<AuthContext, "permissions"> => {
	if (!payload) return false;
	return authContextSchema.safeParse(payload).success;
};

export const authorize =
	(deps: IAuthDeps) =>
	async (required: Permission[]): Promise<AuthContext> => {
		const token = await deps.getToken();
		if (!token) throw new UnauthorizedError();

		const payload = (await deps.jwtService.verify(
			token,
		)) as AuthContext | null;
		if (!isValidAuthPayload(payload)) throw new UnauthorizedError();

		const permissions = await deps.getPermissions(payload.roleId);
		if (!hasPermissions(permissions, required))
			throw new ForbiddenError();

		return { ...payload, permissions };
	};
