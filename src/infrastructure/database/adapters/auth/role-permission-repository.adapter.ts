import { buildPermissionRepositoryAdapter } from "@/src/infrastructure/database/adapters/permission/permission-repository.adapter";
import prisma from "@/lib/prisma";

export const rolePermissionRepositoryAdapter =
  buildPermissionRepositoryAdapter(prisma);
