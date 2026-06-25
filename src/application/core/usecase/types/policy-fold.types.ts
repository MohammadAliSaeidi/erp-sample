import type { BaseContext } from "./context.types";
import type {
  BeforePolicy,
  BeforePolicyWithoutInput,
} from "../policies/policy.types";

export type BeforePolicyStep = BeforePolicy<
  BaseContext,
  BaseContext,
  unknown,
  unknown
>;

export type BeforePolicyWithoutInputStep = BeforePolicyWithoutInput<
  BaseContext,
  BaseContext
>;

export type FoldBefore<
  Policies extends readonly BeforePolicyStep[],
  AccCtx extends BaseContext,
  AccInput,
> = Policies extends readonly [
  infer Head,
  ...infer Tail extends readonly BeforePolicyStep[],
]
  ? Head extends BeforePolicy<
      AccCtx,
      infer NextCtx extends BaseContext,
      AccInput,
      infer NextInput
    >
    ? FoldBefore<Tail, NextCtx, NextInput>
    : never
  : { readonly context: AccCtx; readonly input: AccInput };

export type FoldBeforeWithoutInput<
  Policies extends readonly BeforePolicyWithoutInputStep[],
  AccCtx extends BaseContext,
> = Policies extends readonly [
  infer Head,
  ...infer Tail extends readonly BeforePolicyWithoutInputStep[],
]
  ? Head extends BeforePolicyWithoutInput<
      AccCtx,
      infer NextCtx extends BaseContext
    >
    ? FoldBeforeWithoutInput<Tail, NextCtx>
    : never
  : { readonly context: AccCtx };
