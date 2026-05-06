import { adminAuthContextSchema } from "@/features/auth/domain/schemas/auth-context.schema";
import { IPermissionService } from "@/features/auth/domain/services/permission.service";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { IJwtService } from "./jwt.service";
export type ResolveAuthContext = (token: string | null) => Promise<AuthContext | null>;

export function buildResolveAuthContext(
  jwtService: IJwtService,
  permissionService: Pick<IPermissionService, "getPermissions">,
): ResolveAuthContext {
  return async (token: string | null): Promise<AuthContext | null> => {
    if (!token) return null;

    const rawPayload = await jwtService.verify(token);
    if (!rawPayload) return null;

    const parsed = adminAuthContextSchema.safeParse(rawPayload);
    if (!parsed.success) return null;

    const payload = parsed.data;

    if (payload.grantsAll) {
      return {
        ...payload,
        permissions: [],
      };
    }

    const permissions = await permissionService.getPermissions(payload.roleId);

    return {
      ...payload,
      permissions,
    };
  };
}
