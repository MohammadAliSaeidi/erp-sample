import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { Permission } from "@/features/auth/domain/types/permission.type";
import z, { ZodType } from "zod";

export interface AuthenticatedUsecaseDefinition<
  TSchema extends ZodType,
  TResult,
  TAuthContext = AuthContext,
> {
  key: string;
  auth: "required";
  requiredPermissions: Permission[];
  inputSchema: TSchema;
  execute: (params: {
    input: z.output<TSchema>;
    authContext: TAuthContext;
  }) => Promise<TResult>;
}

export interface PublicUsecaseDefinition<TSchema extends ZodType, TResult> {
  key: string;
  auth: "public";
  inputSchema: TSchema;
  execute: (params: { input: z.output<TSchema> }) => Promise<TResult>;
}

export type UsecaseDefinition<TSchema extends ZodType, TResult> =
  | AuthenticatedUsecaseDefinition<TSchema, TResult>
  | PublicUsecaseDefinition<TSchema, TResult>;

export type UsecaseInput<TDef extends UsecaseDefinition<ZodType, unknown>> =
  TDef extends UsecaseDefinition<infer TSchema, unknown>
    ? z.output<TSchema>
    : never;

export type UsecaseResult<TDef extends UsecaseDefinition<ZodType, unknown>> =
  Awaited<ReturnType<TDef["execute"]>>;

export const authenticatedUsecaseFactory = <TSchema extends ZodType, TResult>(
  definition: AuthenticatedUsecaseDefinition<TSchema, TResult>,
): AuthenticatedUsecaseDefinition<TSchema, TResult> => ({
  ...definition,
  requiredPermissions: definition.requiredPermissions ?? [],
});

export const publicUsecaseFactory = <TSchema extends ZodType, TResult>(
  definition: PublicUsecaseDefinition<TSchema, TResult>,
): PublicUsecaseDefinition<TSchema, TResult> => definition;
