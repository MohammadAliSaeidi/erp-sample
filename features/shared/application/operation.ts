import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { Permission } from "@/features/auth/domain/types/permission.type";
import z from "zod";

export interface AuthenticatedOperationDef<
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

export interface PublicOperationDef<TSchema extends z.ZodType, TResult> {
	key: string;
	auth: "public";
	inputSchema: TSchema;
	execute: (params: {
		input: z.infer<TSchema>;
	}) => Promise<TResult>;
}

export type OperationDef<TSchema extends z.ZodType, TResult> =
	| AuthenticatedOperationDef<TSchema, TResult>
	| PublicOperationDef<TSchema, TResult>;

export type OperationInput<TDef extends OperationDef<z.ZodType, unknown>> =
	TDef extends OperationDef<infer TSchema, unknown>
		? z.infer<TSchema>
		: never;

export type OperationResult<TDef extends OperationDef<z.ZodType, unknown>> =
	TDef extends OperationDef<z.ZodType, infer TResult> ? TResult : never;

export const defineAuthenticatedOperation = <
	TSchema extends z.ZodType,
	TResult,
>(
	definition: AuthenticatedOperationDef<TSchema, TResult>,
) => definition;

export const definePublicOperation = <
	TSchema extends z.ZodType,
	TResult,
>(
	definition: PublicOperationDef<TSchema, TResult>,
) => definition;
