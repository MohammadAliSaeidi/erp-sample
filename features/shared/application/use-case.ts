import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { Permission } from "@/features/auth/domain/types/permission.type";
import z from "zod";

export interface AuthenticatedUsecaseDefinition<
  TSchema extends z.ZodType,
  TResult,
> {
  key: string;
  auth: "required";
  requiredPermissions: Permission[];
  inputSchema: TSchema;
  execute: (params: {
    input: z.infer<TSchema>;
    authContext: AuthContext;
  }) => Promise<TResult>;
}

export interface PublicUsecaseDefinition<TSchema extends z.ZodType, TResult> {
  key: string;
  auth: "public";
  inputSchema: TSchema;
  execute: (params: { input: z.infer<TSchema> }) => Promise<TResult>;
}

export type UsecaseDefinition<TSchema extends z.ZodType, TResult> =
  | AuthenticatedUsecaseDefinition<TSchema, TResult>
  | PublicUsecaseDefinition<TSchema, TResult>;

export type UsecaseInput<TDef extends UsecaseDefinition<z.ZodType, unknown>> =
  TDef extends UsecaseDefinition<infer TSchema, unknown>
    ? z.infer<TSchema>
    : never;

export type UsecaseResult<TDef extends UsecaseDefinition<z.ZodType, unknown>> =
  TDef extends UsecaseDefinition<z.ZodType, infer TResult> ? TResult : never;

export const authenticatedUsecaseFactory = <TSchema extends z.ZodType, TResult>(
  definition: AuthenticatedUsecaseDefinition<TSchema, TResult>,
) => definition;

export const publicUsecaseFactory = <TSchema extends z.ZodType, TResult>(
  definition: PublicUsecaseDefinition<TSchema, TResult>,
) => definition;
