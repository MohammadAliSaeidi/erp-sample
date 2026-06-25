import type { BaseContext } from "./types/context.types";
import type {
  AfterPolicy,
  AfterPolicyWithoutInput,
  BeforePolicy,
  BeforePolicyWithoutInput,
  ErrorPolicy,
  ErrorPolicyWithoutInput,
} from "./policies/policy.types";
import type {
  ExecutionInterceptor,
  ExecutionInterceptorWithoutInput,
} from "./interceptors/types";
import type { Usecase, UsecaseWithoutInput } from "./types/usecase.types";
import type {
  UsecaseWithInputRequest,
  UsecaseWithoutInputRequest,
} from "./runner/runner.types";
import type {
  BeforePolicyStep,
  BeforePolicyWithoutInputStep,
} from "./types/policy-fold.types";

export function defineUsecase<
  TInput,
  TOutput,
  TContext extends BaseContext,
  TDeps = Record<string, never>,
>(
  execute: (input: TInput, context: TContext, deps: TDeps) => Promise<TOutput>,
): Usecase<TInput, TOutput, TContext, TDeps> {
  return { execute };
}

export function defineUsecaseWithoutInput<
  TOutput,
  TContext extends BaseContext,
  TDeps = Record<string, never>,
>(
  execute: (context: TContext, deps: TDeps) => Promise<TOutput>,
): UsecaseWithoutInput<TOutput, TContext, TDeps> {
  return { execute };
}

export function defineBeforePolicy<
  TInContext extends BaseContext,
  TOutContext extends BaseContext,
  TInInput,
  TOutInput = TInInput,
>(
  name: string,
  execute: (
    input: TInInput,
    context: TInContext,
  ) => Promise<{ readonly context: TOutContext; readonly input: TOutInput }>,
): BeforePolicy<TInContext, TOutContext, TInInput, TOutInput> {
  return { name, execute };
}

export function defineBeforePolicyWithoutInput<
  TInContext extends BaseContext,
  TOutContext extends BaseContext,
>(
  name: string,
  execute: (
    context: TInContext,
  ) => Promise<{ readonly context: TOutContext }>,
): BeforePolicyWithoutInput<TInContext, TOutContext> {
  return { name, execute };
}

export function defineAfterPolicy<
  TContext extends BaseContext,
  TInput,
  TOutput,
>(
  name: string,
  execute: AfterPolicy<TContext, TInput, TOutput>["execute"],
): AfterPolicy<TContext, TInput, TOutput> {
  return { name, execute };
}

export function defineAfterPolicyWithoutInput<
  TContext extends BaseContext,
  TOutput,
>(
  name: string,
  execute: AfterPolicyWithoutInput<TContext, TOutput>["execute"],
): AfterPolicyWithoutInput<TContext, TOutput> {
  return { name, execute };
}

export function defineErrorPolicy<TContext extends BaseContext, TInput>(
  name: string,
  execute: ErrorPolicy<TContext, TInput>["execute"],
): ErrorPolicy<TContext, TInput> {
  return { name, execute };
}

export function defineErrorPolicyWithoutInput<TContext extends BaseContext>(
  name: string,
  execute: ErrorPolicyWithoutInput<TContext>["execute"],
): ErrorPolicyWithoutInput<TContext> {
  return { name, execute };
}

export function defineInterceptor<
  TInput,
  TOutput,
  TContext extends BaseContext,
>(
  name: string,
  intercept: ExecutionInterceptor<TInput, TOutput, TContext>["intercept"],
): ExecutionInterceptor<TInput, TOutput, TContext> {
  return { name, intercept };
}

export function defineInterceptorWithoutInput<
  TOutput,
  TContext extends BaseContext,
>(
  name: string,
  intercept: ExecutionInterceptorWithoutInput<
    TOutput,
    TContext
  >["intercept"],
): ExecutionInterceptorWithoutInput<TOutput, TContext> {
  return { name, intercept };
}

export function buildRunWithInputRequest<
  TInput,
  TOutput,
  TInContext extends BaseContext,
  TDeps = Record<string, never>,
  const TBeforePolicies extends readonly BeforePolicyStep[] = readonly [],
>(
  config: UsecaseWithInputRequest<
    TInput,
    TOutput,
    TInContext,
    TDeps,
    TBeforePolicies
  >,
): UsecaseWithInputRequest<
  TInput,
  TOutput,
  TInContext,
  TDeps,
  TBeforePolicies
> {
  return config;
}

export function buildRunWithoutInputRequest<
  TOutput,
  TInContext extends BaseContext,
  TDeps = Record<string, never>,
  const TBeforePolicies extends readonly BeforePolicyWithoutInputStep[] = readonly [],
>(
  config: UsecaseWithoutInputRequest<
    TOutput,
    TInContext,
    TDeps,
    TBeforePolicies
  >,
): UsecaseWithoutInputRequest<
  TOutput,
  TInContext,
  TDeps,
  TBeforePolicies
> {
  return config;
}
