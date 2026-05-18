import { IPermissionRepositoryPort } from "@/src/domain/permission/permission-repository.port";
import { Permission } from "../types/permission.type";

export interface IPermissionService {
  getPermissions(roleId: string): Promise<Permission[]>;

  invalidate(roleId: string): void;
}

export function buildPermissionService(
  permissionRepository: IPermissionRepositoryPort,
  ttlMs = 60_000,
): IPermissionService {
  const cache = new Map<
    string,
    {
      expires: number;
      value: Permission[];
    }
  >();

  async function getPermissions(roleId: string) {
    const now = Date.now();

    const entry = cache.get(roleId);

    if (entry && entry.expires > now) {
      return entry.value;
    }

    const perms = await permissionRepository.getByRoleId(roleId);

    cache.set(roleId, {
      value: perms,
      expires: now + ttlMs,
    });

    return perms;
  }

  function invalidate(roleId: string) {
    cache.delete(roleId);
  }

  return { getPermissions, invalidate };
}
