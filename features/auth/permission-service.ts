import { rolePermissionRepositoryAdapter } from "@/infrastructure/database/adapters/auth/role-permission-repository.adapter";
import { buildPermissionService } from "./domain/services/permission.service";

export const permissionService = buildPermissionService(
  rolePermissionRepositoryAdapter,
);
