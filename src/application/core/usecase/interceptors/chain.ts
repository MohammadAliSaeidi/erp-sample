import type { BaseContext } from "../types/context.types";
import type {
  ExecutionFunction,
  ExecutionFunctionWithoutInput,
  ExecutionInterceptor,
  ExecutionInterceptorWithoutInput,
} from "./types";

export function buildInterceptorChain<
  TInput,
  TOutput,
  TContext extends BaseContext,
>(
  interceptors: ReadonlyArray<
    ExecutionInterceptor<TInput, TOutput, TContext>
  >,
  finalExecution: ExecutionFunction<TInput, TOutput, TContext>,
): ExecutionFunction<TInput, TOutput, TContext> {
  if (interceptors.length === 0) {
    return finalExecution;
  }

  return interceptors.reduceRight((next, interceptor) => {
    return (input: TInput, context: TContext) =>
      interceptor.intercept(input, context, next);
  }, finalExecution);
}

export function buildInterceptorChainWithoutInput<
  TOutput,
  TContext extends BaseContext,
>(
  interceptors: ReadonlyArray<
    ExecutionInterceptorWithoutInput<TOutput, TContext>
  >,
  finalExecution: ExecutionFunctionWithoutInput<TOutput, TContext>,
): ExecutionFunctionWithoutInput<TOutput, TContext> {
  if (interceptors.length === 0) {
    return finalExecution;
  }

  return interceptors.reduceRight((next, interceptor) => {
    return (context: TContext) => interceptor.intercept(context, next);
  }, finalExecution);
}
