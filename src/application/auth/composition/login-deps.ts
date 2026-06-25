import type { LoginUsecaseDeps } from "@/src/application/auth/usecase/login.usecase";
import type { LoginStoreUserDTO } from "@/src/application/auth/usecase/login.usecase";
import prisma from "@/lib/prisma";
import { isHashMatch } from "@/lib/utils/hash/hash";

export const loginDeps: LoginUsecaseDeps = {
  findStoreBySlug: async (storeSlug) =>
    prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true, slug: true },
    }),
  findStoreUserByStoreAndUsername: async (storeId, username) => {
    const storeUser = await prisma.storeUser.findUnique({
      where: {
        storeId_username: { storeId, username },
      },
      select: {
        id: true,
        name: true,
        storeId: true,
        username: true,
        roleId: true,
        password: true,
        role: {
          select: {
            grantsAll: true,
          },
        },
      },
    });

    if (!storeUser) return null;

    return {
      ...storeUser,
      grantsAll: storeUser.role?.grantsAll ?? false,
    } satisfies LoginStoreUserDTO;
  },
  isPasswordMatch: isHashMatch,
};
