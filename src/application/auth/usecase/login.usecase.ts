import {
  Store,
  StoreUser,
} from "@/src/infrastructure/database/orm/prisma/generated/client";
import { getAdminAccessTokenCookieName } from "@/constants/token-names";
import { Role } from "@/features/admin/domain/role";
import { loginInputSchema } from "@/features/auth/domain/schemas/login-body.schema";
import {
  UseCaseNotFoundError,
  UseCaseUnauthorizedError,
} from "@/src/application/shared/errors/use-case-errors";
import {
  buildPublicUsecase,
  PublicUsecaseDefinition,
} from "@/features/shared/application/use-case";
import { AdminAccessTokenPayload } from "@/features/shared/types/admin-access-token-payload";
import { LoginInput } from "@/features/auth/domain/types/login-body.type";

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

export const buildLoginUsecase = (
  deps: LoginUsecaseDeps,
): PublicUsecaseDefinition<typeof loginInputSchema, LoginOperationResult> =>
  buildPublicUsecase({
    key: "auth.login",
    auth: "public",
    inputSchema: loginInputSchema,
    execute: async ({
      input,
    }: {
      input: LoginInput;
    }): Promise<LoginOperationResult> => {
      const store = await deps.findStoreBySlug(input.storeSlug);
      if (!store) {
        throw new UseCaseNotFoundError("Store Not Found");
      }

      const storeUser = await deps.findStoreUserByStoreAndUsername(
        store.id,
        input.username,
      );

      if (!storeUser) {
        throw new UseCaseUnauthorizedError("Incorrect username or password");
      }

      const isValidCredentials =
        storeUser &&
        (await deps.isPasswordMatch(input.password, storeUser.password));

      if (!isValidCredentials) {
        throw new UseCaseUnauthorizedError("Incorrect username or password");
      }

      const cookieName = getAdminAccessTokenCookieName(input.storeSlug);
      const tokenPayload: AdminAccessTokenPayload = {
        sub: storeUser.id,
        adminId: storeUser.id,
        storeId: storeUser.storeId,
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
    },
  });
