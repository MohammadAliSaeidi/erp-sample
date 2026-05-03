"use server";

import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/features/shared/adapters/action/map-usecase-error-to-action-result";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { CreateSpecificationInputDTO } from "../dto/specification/create-specification-input.dto";
import { SpecificationDTO } from "../dto/specification/specification.dto";
import { Specification } from "../../domain/specification/specification.aggregate";
import { createSpecificationUsecase } from "../../application/specification/usecase/create-specification.usecase";

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
