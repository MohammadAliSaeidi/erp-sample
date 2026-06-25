import { validateLoginInput } from "@/src/application/auth/policy/auth.policies";
import {
  loginUsecase,
  type LoginUsecaseDeps,
} from "@/src/application/auth/usecase/login.usecase";
import { buildRunWithInputRequest } from "@/src/application/core/usecase/factories";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";

export function buildLoginRequest(
  input: unknown,
  context: BaseContext,
  deps: LoginUsecaseDeps,
) {
  return buildRunWithInputRequest({
    usecase: loginUsecase,
    input,
    context,
    deps,
    beforePolicies: [validateLoginInput] as const,
  });
}
