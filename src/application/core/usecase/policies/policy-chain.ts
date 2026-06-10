import type { BaseContext } from "../types/context.types";
import type {
  BeforePolicyStep,
  BeforePolicyWithoutInputStep,
  FoldBefore,
  FoldBeforeWithoutInput,
} from "../types/policy-fold.types";
import type {
  AfterPolicy,
  AfterPolicyMetadata,
  AfterPolicyMetadataWithoutInput,
  AfterPolicyWithoutInput,
  ErrorPolicy,
  ErrorPolicyMetadata,
  ErrorPolicyMetadataWithoutInput,
  ErrorPolicyWithoutInput,
} from "./policy.types";

export async function executeBeforePoliciesWithInput<
  TInCtx extends BaseContext,
  TInput,
  const TPolicies extends readonly BeforePolicyStep[] = readonly [],
>(
  policies: TPolicies,
  input: TInput,
  context: TInCtx,
): Promise<FoldBefore<TPolicies, TInCtx, TInput>> {
  let ctx: BaseContext = context;
  let inp: unknown = input;

  for (const policy of policies) {
    const result = await policy.execute(inp, ctx);
    ctx = result.context;
    inp = result.input;
  }

  return {
    context: ctx,
    input: inp,
  } as FoldBefore<TPolicies, TInCtx, TInput>;
}

export async function executeBeforePoliciesWithoutInput<
  TInCtx extends BaseContext,
  const TPolicies extends readonly BeforePolicyWithoutInputStep[] = readonly [],
>(
  policies: TPolicies,
  context: TInCtx,
): Promise<FoldBeforeWithoutInput<TPolicies, TInCtx>> {
  let ctx: BaseContext = context;

  for (const policy of policies) {
    const result = await policy.execute(ctx);
    ctx = result.context;
  }

  return { context: ctx } as FoldBeforeWithoutInput<TPolicies, TInCtx>;
}

export async function executeAfterPolicies<
  TContext extends BaseContext,
  TInput,
  TOutput,
>(
  policies: ReadonlyArray<AfterPolicy<TContext, TInput, TOutput>>,
  metadata: AfterPolicyMetadata<TInput, TOutput>,
  context: TContext,
): Promise<void> {
  for (const policy of policies) {
    await policy.execute(metadata, context);
  }
}

export async function executeAfterPoliciesWithoutInput<
  TContext extends BaseContext,
  TOutput,
>(
  policies: ReadonlyArray<AfterPolicyWithoutInput<TContext, TOutput>>,
  metadata: AfterPolicyMetadataWithoutInput<TOutput>,
  context: TContext,
): Promise<void> {
  for (const policy of policies) {
    await policy.execute(metadata, context);
  }
}

export async function executeErrorPolicies<
  TContext extends BaseContext,
  TInput,
>(
  policies: ReadonlyArray<ErrorPolicy<TContext, TInput>>,
  metadata: ErrorPolicyMetadata<TInput>,
  context: TContext,
): Promise<void> {
  for (const policy of policies) {
    await policy.execute(metadata, context);
  }
}

export async function executeErrorPoliciesWithoutInput<
  TContext extends BaseContext,
>(
  policies: ReadonlyArray<ErrorPolicyWithoutInput<TContext>>,
  metadata: ErrorPolicyMetadataWithoutInput,
  context: TContext,
): Promise<void> {
  for (const policy of policies) {
    await policy.execute(metadata, context);
  }
}
