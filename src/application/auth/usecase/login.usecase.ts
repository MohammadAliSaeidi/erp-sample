import { getAdminAccessTokenCookieName } from "@/constants/token-names";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/src/application/core/errors/application.error";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";
import {
  Store,
  StoreUser,
} from "@/src/infrastructure/database/orm/prisma/generated/client";
import { Role } from "@/features/admin/domain/role";
import { AdminAccessTokenPayload } from "@/features/shared/types/admin-access-token-payload";
import { LoginInput } from "@/features/auth/domain/types/login-body.type";
import { brand } from "@/lib/brand";

export type LoginStoreDTO = Pick<Store, "id" | "slug">;
export type LoginStoreUserDTO = Pick<
  StoreUser,
  "id" | "name" | "storeId" | "username" | "roleId" | "password"
> &
  Pick<Role, "grantsAll">;

export interface LoginUsecaseDeps {
  findStoreBySlug: (storeSlug: string) => Promise<LoginStoreDTO | null>;
  findStoreUserByStoreAndUsername: (
    storeId: string,
    username: string,
  ) => Promise<LoginStoreUserDTO | null>;
  isPasswordMatch: (plainText: string, hashedText: string) => Promise<boolean>;
}

export interface LoginOperationResult {
  cookieName: string;
  tokenPayload: AdminAccessTokenPayload;
}

export const loginUsecase = defineUsecase<
  LoginInput,
  LoginOperationResult,
  BaseContext,
  LoginUsecaseDeps
>(async (input, _context, deps) => {
  const store = await deps.findStoreBySlug(input.storeSlug);
  if (!store) {
    throw new NotFoundError("Store Not Found");
  }

  const storeUser = await deps.findStoreUserByStoreAndUsername(
    store.id,
    input.username,
  );

  if (!storeUser) {
    throw new UnauthorizedError("Incorrect username or password");
  }

  const isValidCredentials = await deps.isPasswordMatch(
    input.password,
    storeUser.password,
  );

  if (!isValidCredentials) {
    throw new UnauthorizedError("Incorrect username or password");
  }

  const cookieName = getAdminAccessTokenCookieName(input.storeSlug);
  const tokenPayload: AdminAccessTokenPayload = {
    sub: storeUser.id,
    adminId: brand(storeUser.id),
    storeId: brand(storeUser.storeId),
    storeSlug: input.storeSlug,
    grantsAll: storeUser.grantsAll,
    exp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).getTime(),
    iat: Date.now(),
    username: storeUser.username,
    roleId: storeUser.roleId,
  };

  return {
    cookieName,
    tokenPayload,
  };
});
