import { Permission } from "../../features/auth/domain/types/permission.type";

export interface IPermissionRepositoryPort {
  getByRoleId(roleId: string): Promise<Permission[]>;
}
