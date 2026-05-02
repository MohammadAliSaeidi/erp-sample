import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { Permission } from "@/features/auth/domain/types/permission.type";
import {
	UseCaseForbiddenError,
	UseCaseUnauthorizedError,
	UseCaseValidationError,
} from "@/features/shared/application/errors/use-case-errors";
import {
	authenticatedUsecaseFactory,
	publicUsecaseFactory,
} from "@/features/shared/application/use-case";
import { runUseCase } from "@/features/shared/application/run-use-case";
import z from "zod";

const READ_PERMISSION = "items:read" as Permission;

const AUTH_CONTEXT: AuthContext = {
	adminId: "admin-1",
	storeId: "store-1",
	storeSlug: "store-1",
	username: "admin-user",
	roleId: "role-1",
	grantsAll: false,
	sub: "admin-1",
	exp: 9999999999,
	iat: 0,
	permissions: [READ_PERMISSION],
};

describe("runOperation", () => {
	it("throws OperationValidationError for invalid input", async () => {
		const operation = publicUsecaseFactory({
			key: "test.public",
			auth: "public",
			inputSchema: z.object({ value: z.number() }),
			execute: async ({ input }) => input.value,
		});

		await expect(
			runUseCase({
				useCase: operation,
				input: { value: "not-a-number" },
			}),
		).rejects.toBeInstanceOf(UseCaseValidationError);
	});

	it("throws OperationUnauthorizedError for authenticated operation without auth context", async () => {
		const operation = authenticatedUsecaseFactory({
			key: "test.auth-required",
			auth: "required",
			requiredPermissions: [READ_PERMISSION],
			inputSchema: z.object({ value: z.number() }),
			execute: async ({ input }) => input.value,
		});

		await expect(
			runUseCase({
				useCase: operation,
				input: { value: 2 },
			}),
		).rejects.toBeInstanceOf(UseCaseUnauthorizedError);
	});

	it("throws OperationForbiddenError when required permissions are missing", async () => {
		const operation = authenticatedUsecaseFactory({
			key: "test.forbidden",
			auth: "required",
			requiredPermissions: [READ_PERMISSION],
			inputSchema: z.object({ value: z.number() }),
			execute: async ({ input }) => input.value,
		});

		await expect(
			runUseCase({
				useCase: operation,
				input: { value: 2 },
				authContext: {
					...AUTH_CONTEXT,
					permissions: [],
				},
			}),
		).rejects.toBeInstanceOf(UseCaseForbiddenError);
	});

	it("executes an authenticated operation when permissions match", async () => {
		const operation = authenticatedUsecaseFactory({
			key: "test.success",
			auth: "required",
			requiredPermissions: [READ_PERMISSION],
			inputSchema: z.object({ value: z.number() }),
			execute: async ({ input, authContext }) => ({
				result: input.value * 2,
				storeId: authContext.storeId,
			}),
		});

		await expect(
			runUseCase({
				useCase: operation,
				input: { value: 4 },
				authContext: AUTH_CONTEXT,
			}),
		).resolves.toMatchObject({
			result: 8,
			storeId: "store-1",
		});
	});
});
