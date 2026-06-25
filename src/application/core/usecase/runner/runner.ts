import type { BaseContext } from "../types/context.types";
import {
  executeAfterPolicies,
  executeAfterPoliciesWithoutInput,
  executeBeforePoliciesWithInput,
  executeBeforePoliciesWithoutInput,
  executeErrorPolicies,
  executeErrorPoliciesWithoutInput,
} from "../policies/policy-chain";
import {
  buildInterceptorChain,
  buildInterceptorChainWithoutInput,
} from "../interceptors/chain";
import type {
  BeforePolicyStep,
  BeforePolicyWithoutInputStep,
} from "../types/policy-fold.types";
import type {
  UsecaseRunner,
  UsecaseWithInputRequest,
  UsecaseWithoutInputRequest,
} from "./runner.types";

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

export function buildUsecaseRunner(): UsecaseRunner {
  return {
    async runWithInput<
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
    ): Promise<TOutput> {
      const {
        usecase,
        input,
        context,
        deps,
        beforePolicies = [],
        afterPolicies = [],
        errorPolicies = [],
        interceptors = [],
      } = config;

      let refinedInput: unknown = input;
      let refinedContext: BaseContext = context;

      try {
        const folded = await executeBeforePoliciesWithInput(
          beforePolicies,
          input,
          context,
        );
        refinedInput = folded.input;
        refinedContext = folded.context;

        const executor = buildInterceptorChain(
          interceptors,
          async (inp, ctx) => usecase.execute(inp, ctx, deps),
        );

        const output = await executor(
          refinedInput as Parameters<typeof executor>[0],
          refinedContext as Parameters<typeof executor>[1],
        );

        await executeAfterPolicies(
          afterPolicies,
          {
            input: refinedInput,
            output,
            durationMs: 0,
          },
          refinedContext as BaseContext,
        );

        return output;
      } catch (error) {
        await executeErrorPolicies(
          errorPolicies,
          {
            input: refinedInput,
            error: toError(error),
            durationMs: 0,
          },
          refinedContext as BaseContext,
        );
        throw error;
      }
    },

    async runWithoutInput<
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
    ): Promise<TOutput> {
      const {
        usecase,
        context,
        deps,
        beforePolicies = [],
        afterPolicies = [],
        errorPolicies = [],
        interceptors = [],
      } = config;

      let refinedContext: BaseContext = context;

      try {
        const folded = await executeBeforePoliciesWithoutInput(
          beforePolicies,
          context,
        );
        refinedContext = folded.context;

        const executor = buildInterceptorChainWithoutInput(
          interceptors,
          async (ctx) => usecase.execute(ctx, deps),
        );

        const output = await executor(
          refinedContext as Parameters<typeof executor>[0],
        );

        await executeAfterPoliciesWithoutInput(
          afterPolicies,
          {
            output,
            durationMs: 0,
          },
          refinedContext as BaseContext,
        );

        return output;
      } catch (error) {
        await executeErrorPoliciesWithoutInput(
          errorPolicies,
          {
            error: toError(error),
            durationMs: 0,
          },
          refinedContext as BaseContext,
        );
        throw error;
      }
    },
  };
}
