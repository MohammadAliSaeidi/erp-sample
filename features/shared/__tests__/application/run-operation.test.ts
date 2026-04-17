import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { Permission } from "@/features/auth/domain/types/permission.type";
import {
	OperationForbiddenError,
	OperationUnauthorizedError,
	OperationValidationError,
} from "@/features/shared/application/errors/operation-errors";
import {
	defineAuthenticatedOperation,
	definePublicOperation,
} from "@/features/shared/application/operation";
import { runOperation } from "@/features/shared/application/run-operation";
import z from "zod";

const READ_PERMISSION = "items:read" as Permission;

const AUTH_CONTEXT: AuthContext = {
	adminId: "admin-1",
	storeId: "store-1",
	storeSlug: "store-1",
	username: "admin-user",
	roleId: "role-1",
	permissions: [READ_PERMISSION],
};

describe("runOperation", () => {
	it("throws OperationValidationError for invalid input", async () => {
		const operation = definePublicOperation({
			key: "test.public",
			auth: "public",
			inputSchema: z.object({ value: z.number() }),
			execute: async ({ input }) => input.value,
		});

		await expect(
			runOperation({
				operation,
				input: { value: "not-a-number" },
			}),
		).rejects.toBeInstanceOf(OperationValidationError);
	});

	it("throws OperationUnauthorizedError for authenticated operation without auth context", async () => {
		const operation = defineAuthenticatedOperation({
			key: "test.auth-required",
			auth: "required",
			requiredPermissions: [READ_PERMISSION],
			inputSchema: z.object({ value: z.number() }),
			execute: async ({ input }) => input.value,
		});

		await expect(
			runOperation({
				operation,
				input: { value: 2 },
			}),
		).rejects.toBeInstanceOf(OperationUnauthorizedError);
	});

	it("throws OperationForbiddenError when required permissions are missing", async () => {
		const operation = defineAuthenticatedOperation({
			key: "test.forbidden",
			auth: "required",
			requiredPermissions: [READ_PERMISSION],
			inputSchema: z.object({ value: z.number() }),
			execute: async ({ input }) => input.value,
		});

		await expect(
			runOperation({
				operation,
				input: { value: 2 },
				authContext: {
					...AUTH_CONTEXT,
					permissions: [],
				},
			}),
		).rejects.toBeInstanceOf(OperationForbiddenError);
	});

	it("executes an authenticated operation when permissions match", async () => {
		const operation = defineAuthenticatedOperation({
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
			runOperation({
				operation,
				input: { value: 4 },
				authContext: AUTH_CONTEXT,
			}),
		).resolves.toMatchObject({
			result: 8,
			storeId: "store-1",
		});
	});
});
