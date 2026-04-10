import { hasPermissions } from "@/features/auth/domain/lib/has-permissions";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import z from "zod";
import {
	OperationDef,
	OperationInput,
	OperationResult,
} from "./operation";
import {
	OperationForbiddenError,
	OperationUnauthorizedError,
	OperationValidationError,
} from "./errors/operation-errors";

export interface RunOperationParams<
	TDef extends OperationDef<z.ZodType, unknown>,
> {
	operation: TDef;
	rawInput: unknown;
	authContext?: AuthContext | null;
}

export async function runOperation<
	TDef extends OperationDef<z.ZodType, unknown>,
>(params: RunOperationParams<TDef>): Promise<OperationResult<TDef>> {
	const { operation, rawInput, authContext } = params;
	const parsed = operation.inputSchema.safeParse(rawInput);

	if (!parsed.success) {
		throw new OperationValidationError(parsed.error);
	}

	if (operation.auth === "required") {
		if (!authContext) {
			throw new OperationUnauthorizedError(
				`Operation ${operation.key} requires authentication`,
			);
		}

		const userPermissions = authContext.permissions ?? [];
		if (!hasPermissions(userPermissions, operation.requiredPermissions)) {
			throw new OperationForbiddenError(
				`Operation ${operation.key} requires additional permissions`,
			);
		}

		return operation.execute({
			input: parsed.data as OperationInput<TDef>,
			authContext,
		}) as Promise<OperationResult<TDef>>;
	}

	return operation.execute({
		input: parsed.data as OperationInput<TDef>,
	}) as Promise<OperationResult<TDef>>;
}
