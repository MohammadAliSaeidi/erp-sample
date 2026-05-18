"use server";

import {
  buildLoginUsecase,
  LoginStoreUserDTO,
} from "@/src/application/auth/usecase/login.usecase";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { runUsecase } from "@/features/shared/application/run-use-case";
import prisma from "@/lib/prisma";
import { setTokenCookie } from "@/lib/token";
import { isHashMatch } from "@/lib/utils/hash/hash";
import { LoginInput } from "../domain/types/login-body.type";

const loginOperation = buildLoginUsecase({
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
    const loginResult = await runUsecase({
      useCase: loginOperation,
      input: loginInput,
    });

    await setTokenCookie(loginResult.cookieName, loginResult.tokenPayload);

    return actionSuccess(null);
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
