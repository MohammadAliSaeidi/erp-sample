"use server";

import {
  buildLoginOperation,
  LoginStoreUserDTO,
} from "@/features/auth/application/operations/login.operation";
import {
  ActionResult,
  actionSuccess,
  mapOperationErrorToActionResult,
} from "@/features/shared/adapters/action/map-operation-error-to-action-result";
import { runOperation } from "@/features/shared/application/run-operation";
import prisma from "@/features/shared/lib/prisma";
import { setTokenCookie } from "@/features/shared/lib/token";
import { isHashMatch } from "@/features/shared/lib/utils/hash/hash";
import { LoginInput } from "../domain/types/login-body.type";

const loginOperation = buildLoginOperation({
  findStoreBySlug: async (storeSlug: string) => {
    return prisma.store.findUnique({
      where: { slug: storeSlug },
      select: { id: true, slug: true },
    });
  },
  findStoreUserByStoreAndUsername: async (
    storeId: string,
    username: string,
  ): Promise<LoginStoreUserDTO | null> => {
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
      grantsAll: storeUser?.role?.grantsAll ?? false,
    };
  },
  isPasswordMatch: isHashMatch,
});

export async function loginAction(
  loginInput: LoginInput,
): Promise<ActionResult<null>> {
  try {
    const loginResult = await runOperation({
      operation: loginOperation,
      input: loginInput,
    });

    await setTokenCookie(loginResult.cookieName, loginResult.tokenPayload);

    return actionSuccess(null);
  } catch (error) {
    return mapOperationErrorToActionResult(error);
  }
}
