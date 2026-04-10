import { buildLoginOperation } from "@/features/auth/application/operations/login.operation";
import {
	OperationNotFoundError,
	OperationUnauthorizedError,
	OperationValidationError,
} from "@/features/shared/application/errors/operation-errors";
import { runOperation } from "@/features/shared/application/run-operation";

describe("login operation", () => {
	it("validates required input fields", async () => {
		const operation = buildLoginOperation({
			findStoreBySlug: jest.fn(),
			findStoreUserByStoreAndUsername: jest.fn(),
			isPasswordMatch: jest.fn(),
		});

		await expect(
			runOperation({
				operation,
				rawInput: {
					username: "admin",
					password: "1234",
				},
			}),
		).rejects.toBeInstanceOf(OperationValidationError);
	});

	it("throws OperationNotFoundError when store does not exist", async () => {
		const operation = buildLoginOperation({
			findStoreBySlug: jest.fn().mockResolvedValue(null),
			findStoreUserByStoreAndUsername: jest.fn(),
			isPasswordMatch: jest.fn(),
		});

		await expect(
			runOperation({
				operation,
				rawInput: {
					storeSlug: "missing-store",
					username: "admin",
					password: "1234",
				},
			}),
		).rejects.toBeInstanceOf(OperationNotFoundError);
	});

	it("throws OperationUnauthorizedError for invalid credentials", async () => {
		const operation = buildLoginOperation({
			findStoreBySlug: jest
				.fn()
				.mockResolvedValue({ id: "store-1", slug: "store-1" }),
			findStoreUserByStoreAndUsername: jest
				.fn()
				.mockResolvedValue({
					id: "user-1",
					name: "Admin",
					storeId: "store-1",
					username: "admin",
					roleId: "role-1",
					password: "hashed-password",
				}),
			isPasswordMatch: jest.fn().mockResolvedValue(false),
		});

		await expect(
			runOperation({
				operation,
				rawInput: {
					storeSlug: "store-1",
					username: "admin",
					password: "bad-pass",
				},
			}),
		).rejects.toBeInstanceOf(OperationUnauthorizedError);
	});

	it("returns token payload and cookie name when credentials are valid", async () => {
		const operation = buildLoginOperation({
			findStoreBySlug: jest
				.fn()
				.mockResolvedValue({ id: "store-1", slug: "store-1" }),
			findStoreUserByStoreAndUsername: jest
				.fn()
				.mockResolvedValue({
					id: "user-1",
					name: "Admin",
					storeId: "store-1",
					username: "admin",
					roleId: "role-1",
					password: "hashed-password",
				}),
			isPasswordMatch: jest.fn().mockResolvedValue(true),
		});

		await expect(
			runOperation({
				operation,
				rawInput: {
					storeSlug: "store-1",
					username: "admin",
					password: "correct-pass",
				},
			}),
		).resolves.toMatchObject({
			cookieName: "ADMIN_ACCESS_TOKEN_COOKIE_STORE_1",
			tokenPayload: {
				sub: "user-1",
				adminId: "user-1",
				storeId: "store-1",
				storeSlug: "store-1",
				username: "admin",
				roleId: "role-1",
			},
		});
	});
});
