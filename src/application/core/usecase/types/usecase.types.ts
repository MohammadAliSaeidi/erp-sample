import type { BaseContext } from "./context.types";

export interface Usecase<
  TInput,
  TOutput,
  TContext extends BaseContext = BaseContext,
  TDeps = Record<string, never>,
> {
  execute(input: TInput, context: TContext, deps: TDeps): Promise<TOutput>;
}

export interface UsecaseWithoutInput<
  TOutput,
  TContext extends BaseContext = BaseContext,
  TDeps = Record<string, never>,
> {
  execute(context: TContext, deps: TDeps): Promise<TOutput>;
}
