import type { BaseContext } from "../types/context.types";

export type ExecutionFunction<TInput, TOutput, TContext extends BaseContext> = (
  input: TInput,
  context: TContext,
) => Promise<TOutput>;

export type ExecutionFunctionWithoutInput<
  TOutput,
  TContext extends BaseContext,
> = (context: TContext) => Promise<TOutput>;

export interface ExecutionInterceptor<
  TInput,
  TOutput,
  TContext extends BaseContext,
> {
  readonly name: string;
  intercept(
    input: TInput,
    context: TContext,
    next: ExecutionFunction<TInput, TOutput, TContext>,
  ): Promise<TOutput>;
}

export interface ExecutionInterceptorWithoutInput<
  TOutput,
  TContext extends BaseContext,
> {
  readonly name: string;
  intercept(
    context: TContext,
    next: ExecutionFunctionWithoutInput<TOutput, TContext>,
  ): Promise<TOutput>;
}
