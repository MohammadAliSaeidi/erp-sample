import { buildRolePermissionRepository } from "@/domain/permission/permission-repository.port";
import prisma from "@/lib/prisma";

export const rolePermissionRepositoryAdapter =
		buildRolePermissionRepository(prisma);