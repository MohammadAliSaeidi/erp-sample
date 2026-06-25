import type { BaseContext } from "../types/context.types";
import type {
  BeforePolicyStep,
  BeforePolicyWithoutInputStep,
  FoldBefore,
  FoldBeforeWithoutInput,
} from "../types/policy-fold.types";
import type { Usecase, UsecaseWithoutInput } from "../types/usecase.types";
import type {
  ExecutionInterceptor,
  ExecutionInterceptorWithoutInput,
} from "../interceptors/types";
import type {
  AfterPolicy,
  AfterPolicyWithoutInput,
  ErrorPolicy,
  ErrorPolicyWithoutInput,
} from "../policies/policy.types";

export interface UsecaseRunner {
  runWithInput: <
    TInput,
    TOutput,
    TInContext extends BaseContext,
    TDeps = Record<string, never>,
    TBeforePolicies extends readonly BeforePolicyStep[] = readonly [],
  >(
    config: UsecaseWithInputRequest<
      TInput,
      TOutput,
      TInContext,
      TDeps,
      TBeforePolicies
    >,
  ) => Promise<TOutput>;

  runWithoutInput: <
    TOutput,
    TInContext extends BaseContext,
    TDeps = Record<string, never>,
    TBeforePolicies extends readonly BeforePolicyWithoutInputStep[] =
      readonly [],
  >(
    config: UsecaseWithoutInputRequest<
      TOutput,
      TInContext,
      TDeps,
      TBeforePolicies
    >,
  ) => Promise<TOutput>;
}

export interface UsecaseWithInputRequest<
  TInput,
  TOutput,
  TInContext extends BaseContext,
  TDeps = Record<string, never>,
  TBeforePolicies extends readonly BeforePolicyStep[] = readonly [],
> {
  readonly usecase: Usecase<
    FoldBefore<TBeforePolicies, TInContext, TInput>["input"],
    TOutput,
    FoldBefore<TBeforePolicies, TInContext, TInput>["context"],
    TDeps
  >;
  readonly input: TInput;
  readonly context: TInContext;
  readonly deps: TDeps;
  readonly beforePolicies?: TBeforePolicies;
  readonly afterPolicies?: ReadonlyArray<
    AfterPolicy<
      FoldBefore<TBeforePolicies, TInContext, TInput>["context"],
      FoldBefore<TBeforePolicies, TInContext, TInput>["input"],
      TOutput
    >
  >;
  readonly errorPolicies?: ReadonlyArray<
    ErrorPolicy<
      FoldBefore<TBeforePolicies, TInContext, TInput>["context"],
      FoldBefore<TBeforePolicies, TInContext, TInput>["input"]
    >
  >;
  readonly interceptors?: ReadonlyArray<
    ExecutionInterceptor<
      FoldBefore<TBeforePolicies, TInContext, TInput>["input"],
      TOutput,
      FoldBefore<TBeforePolicies, TInContext, TInput>["context"]
    >
  >;
}

export interface UsecaseWithoutInputRequest<
  TOutput,
  TInContext extends BaseContext,
  TDeps = Record<string, never>,
  TBeforePolicies extends readonly BeforePolicyWithoutInputStep[] =
    readonly [],
> {
  readonly usecase: UsecaseWithoutInput<
    TOutput,
    FoldBeforeWithoutInput<TBeforePolicies, TInContext>["context"],
    TDeps
  >;
  readonly context: TInContext;
  readonly deps: TDeps;
  readonly beforePolicies?: TBeforePolicies;
  readonly afterPolicies?: ReadonlyArray<
    AfterPolicyWithoutInput<
      FoldBeforeWithoutInput<TBeforePolicies, TInContext>["context"],
      TOutput
    >
  >;
  readonly errorPolicies?: ReadonlyArray<
    ErrorPolicyWithoutInput<
      FoldBeforeWithoutInput<TBeforePolicies, TInContext>["context"]
    >
  >;
  readonly interceptors?: ReadonlyArray<
    ExecutionInterceptorWithoutInput<
      TOutput,
      FoldBeforeWithoutInput<TBeforePolicies, TInContext>["context"]
    >
  >;
}
