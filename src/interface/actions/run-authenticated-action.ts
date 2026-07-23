import { requireSsrAuth } from "@/features/auth";
import {
  AuthenticatedUsecaseDefinition,
  UsecaseInput,
  UsecaseResult,
} from "@/features/shared/application/use-case";
import { runUsecase } from "@/features/shared/application/run-use-case";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { ZodType } from "zod";

export type RunAuthenticatedActionAuth = {
  storeSlug?: string;
};

export type RunAuthenticatedActionParams<
  TDef extends AuthenticatedUsecaseDefinition<ZodType, unknown>,
> = {
  useCase: TDef;
  input: UsecaseInput<TDef>;
  auth?: RunAuthenticatedActionAuth;
};

/**
 * Server-action transport adapter: resolve SSR auth, run use case, map to ActionResult.
 */
export async function runAuthenticatedAction<
  TDef extends AuthenticatedUsecaseDefinition<ZodType, unknown>,
>(
  params: RunAuthenticatedActionParams<TDef>,
): Promise<ActionResult<UsecaseResult<TDef>>> {
  try {
    const authContext = await requireSsrAuth(params.auth ?? {});
    const data = await runUsecase({
      useCase: params.useCase,
      input: params.input,
      authContext,
    });

    return actionSuccess(data);
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
