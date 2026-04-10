import { PrismaClient } from "@/app/generated/prisma/client";
import { Permission } from "../types/permission.type";

export interface IRolePermissionRepository {
	getByRoleId(roleId: string): Promise<Permission[]>;
}

export interface IRolePermissionRepositoryBuilder {
	(prismaDB: PrismaClient): IRolePermissionRepository;
}

export const buildRolePermissionRepository: IRolePermissionRepositoryBuilder = (
	prismaDB: PrismaClient,
) => {
	return {
		getByRoleId: async (roleId: string) => {
			const permissionsOfTheRole =
				await prismaDB.rolePermission.findMany({
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
				(permission): Permission =>
					permission.permission.key as Permission,
			);
		},
	};
};
