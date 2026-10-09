import { loginInputDTOSchema } from "@/src/application/auth/usecase/login-input-dto.schema";
import { createValidateInputPolicy } from "@/src/application/core/usecase/policies/common-policies";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";

export const validateLoginInput = createValidateInputPolicy<
	BaseContext,
	typeof loginInputDTOSchema
>("ValidateLoginInput", loginInputDTOSchema);
