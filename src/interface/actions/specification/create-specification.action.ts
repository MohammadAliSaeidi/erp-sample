"use server";

import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { CreateSpecificationInputDTO } from "@/src/application/specification/dto/create-specification-input.dto";
import { SpecificationDTO } from "@/src/application/specification/dto/specification.dto";
import { Specification } from "@/src/domain/specification/specification.aggregate";
import { createSpecificationUsecase } from "@/src/application/specification/usecase/create-specification.usecase";

export async function createSpecificationAction(
  rawInput: CreateSpecificationInputDTO,
): Promise<ActionResult<SpecificationDTO>> {
  try {
    const authContext = await requireSsrAuth();

    const createdCategory: Specification = await runUsecase({
      useCase: createSpecificationUsecase,
      input: rawInput,
      authContext,
    });

    return actionSuccess({ ...createdCategory });
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
