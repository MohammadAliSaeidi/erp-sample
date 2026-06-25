import { createValidateInputPolicy } from "@/src/application/core/usecase/policies/common-policies";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";
import { loginInputSchema } from "@/features/auth/domain/schemas/login-body.schema";

export const validateLoginInput = createValidateInputPolicy<
  BaseContext,
  typeof loginInputSchema
>("ValidateLoginInput", loginInputSchema);
