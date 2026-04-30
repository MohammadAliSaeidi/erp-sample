import { hasPermissions } from "@/features/auth/domain/lib/has-permissions";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { Permission } from "@/features/auth/domain/types/permission.type";
import z from "zod";
import { UsecaseDefinition, UsecaseInput, UsecaseResult } from "./use-case";
import {
  UseCaseForbiddenError,
  UseCaseUnauthorizedError,
  UseCaseValidationError,
} from "./errors/use-case-errors";

export interface RunUseCaseParams<
  TDef extends UsecaseDefinition<z.ZodType, unknown>,
> {
  useCase: TDef;
  input: unknown;
  authContext?: AuthContext | null;
}

export async function runUseCase<
  TDef extends UsecaseDefinition<z.ZodType, unknown>,
>(params: RunUseCaseParams<TDef>): Promise<UsecaseResult<TDef>> {
  const { useCase, input, authContext } = params;
  const parsed = useCase.inputSchema.safeParse(input);

  if (!parsed.success) {
    throw new UseCaseValidationError(parsed.error);
  }

  if (useCase.auth === "required") {
    if (!authContext) {
      throw new UseCaseUnauthorizedError(
        `Use Case ${useCase.key} requires authentication`,
      );
    }

    const userPermissions = (authContext.permissions ?? []) as Permission[];

    const hasRequiredPermissions =
      authContext.grantsAll ||
      hasPermissions(userPermissions, useCase.requiredPermissions);

    if (!hasRequiredPermissions) {
      throw new UseCaseForbiddenError(
        `Use Case ${useCase.key} requires additional permissions`,
      );
    }

    return useCase.execute({
      input: parsed.data as UsecaseInput<TDef>,
      authContext,
    }) as Promise<UsecaseResult<TDef>>;
  }

  return useCase.execute({
    input: parsed.data as UsecaseInput<TDef>,
  }) as Promise<UsecaseResult<TDef>>;
}
