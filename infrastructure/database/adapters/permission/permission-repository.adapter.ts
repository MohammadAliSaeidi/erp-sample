import { Permission } from "@/features/auth/domain/types/permission.type";
import { PrismaClient } from "@/app/generated/prisma/client";
import { IPermissionRepositoryPort } from "@/domain/permission/permission-repository.port";

export interface IPermissionRepositoryAdapterBuilder {
  (prismaDB: PrismaClient): IPermissionRepositoryPort;
}

export const buildPermissionRepositoryAdapter: IPermissionRepositoryAdapterBuilder =
  (prisma: PrismaClient): IPermissionRepositoryPort => ({
    getByRoleId: async (roleId: string) => {
      const permissionsOfTheRole = await prisma.rolePermission.findMany({
        where: {
          roleId: roleId,
        },
        select: {
          permission: {
            select: {
              key: true,
            },
          },
        },
      });

      return permissionsOfTheRole.map(
        (permission): Permission => permission.permission.key as Permission,
      );
    },
  });
