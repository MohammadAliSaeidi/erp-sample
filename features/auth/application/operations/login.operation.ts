import { Store, StoreUser } from "@/app/generated/prisma/client";
import { getAdminAccessTokenCookieName } from "@/constants/token-names";
import { loginBodySchema } from "@/features/auth/domain/schemas/login-body.schema";
import {
	OperationNotFoundError,
	OperationUnauthorizedError,
} from "@/features/shared/application/errors/operation-errors";
import { definePublicOperation } from "@/features/shared/application/operation";
import { AdminAccessTokenPayload } from "@/features/shared/types/admin-access-token-payload";
import z from "zod";

const loginOperationInputSchema = loginBodySchema.extend({
	storeSlug: z.string().min(1, "Store slug is required"),
});

type LoginOperationInput = z.infer<typeof loginOperationInputSchema>;

type LoginStore = Pick<Store, "id" | "slug">;
type LoginStoreUser = Pick<
	StoreUser,
	"id" | "name" | "storeId" | "username" | "roleId" | "password"
>;

export interface LoginOperationDeps {
	findStoreBySlug: (storeSlug: string) => Promise<LoginStore | null>;
	findStoreUserByStoreAndUsername: (
		storeId: string,
		username: string,
	) => Promise<LoginStoreUser | null>;
	isPasswordMatch: (plainText: string, hashedText: string) => Promise<boolean>;
}

export interface LoginOperationResult {
	cookieName: string;
	tokenPayload: AdminAccessTokenPayload;
}

export const buildLoginOperation = (deps: LoginOperationDeps) =>
	definePublicOperation({
		key: "auth.login",
		auth: "public",
		inputSchema: loginOperationInputSchema,
		execute: async ({
			input,
		}: {
			input: LoginOperationInput;
		}): Promise<LoginOperationResult> => {
			const store = await deps.findStoreBySlug(input.storeSlug);
			if (!store) {
				throw new OperationNotFoundError("Store Not Found");
			}

			const storeUser = await deps.findStoreUserByStoreAndUsername(
				store.id,
				input.username,
			);
			const isValidCredentials =
				storeUser &&
				(await deps.isPasswordMatch(
					input.password,
					storeUser.password,
				));

			if (!isValidCredentials) {
				throw new OperationUnauthorizedError(
					"Incorrect username or password",
				);
			}

			const cookieName = getAdminAccessTokenCookieName(input.storeSlug);
			const tokenPayload: AdminAccessTokenPayload = {
				sub: storeUser.id,
				adminId: storeUser.id,
				name: storeUser.name,
				storeId: storeUser.storeId,
				storeSlug: input.storeSlug,
				username: storeUser.username,
				roleId: storeUser.roleId,
			};

			return {
				cookieName,
				tokenPayload,
			};
		},
	});
