import type { BaseContext } from "../types/context.types";

export interface AfterPolicyMetadata<TInput, TOutput> {
  readonly input: TInput;
  readonly output: TOutput;
  readonly durationMs: number;
}

export interface ErrorPolicyMetadata<TInput> {
  readonly input: TInput;
  readonly error: Error;
  readonly durationMs: number;
}

export interface BeforePolicy<
  TInContext extends BaseContext,
  TOutContext extends BaseContext,
  TInInput = unknown,
  TOutInput = TInInput,
> {
  readonly name: string;
  execute(
    input: TInInput,
    context: TInContext,
  ): Promise<{ readonly context: TOutContext; readonly input: TOutInput }>;
}

export interface BeforePolicyWithoutInput<
  TInContext extends BaseContext,
  TOutContext extends BaseContext,
> {
  readonly name: string;
  execute(
    context: TInContext,
  ): Promise<{ readonly context: TOutContext }>;
}

export interface AfterPolicy<TContext extends BaseContext, TInput, TOutput> {
  readonly name: string;
  execute(
    metadata: AfterPolicyMetadata<TInput, TOutput>,
    context: TContext,
  ): Promise<void>;
}

export interface AfterPolicyMetadataWithoutInput<TOutput> {
  readonly output: TOutput;
  readonly durationMs: number;
}

export interface AfterPolicyWithoutInput<
  TContext extends BaseContext,
  TOutput,
> {
  readonly name: string;
  execute(
    metadata: AfterPolicyMetadataWithoutInput<TOutput>,
    context: TContext,
  ): Promise<void>;
}

export interface ErrorPolicy<TContext extends BaseContext, TInput> {
  readonly name: string;
  execute(
    metadata: ErrorPolicyMetadata<TInput>,
    context: TContext,
  ): Promise<void>;
}

export interface ErrorPolicyMetadataWithoutInput {
  readonly error: Error;
  readonly durationMs: number;
}

export interface ErrorPolicyWithoutInput<TContext extends BaseContext> {
  readonly name: string;
  execute(
    metadata: ErrorPolicyMetadataWithoutInput,
    context: TContext,
  ): Promise<void>;
}
