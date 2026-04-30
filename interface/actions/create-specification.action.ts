"use server";

import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapOperationErrorToActionResult,
} from "@/features/shared/adapters/action/map-operation-error-to-action-result";
import { runUseCase } from "@/features/shared/application/run-use-case";
import { CreateSpecificationInputDTO } from "../dto/specification/create-specification-input.dto";
import { SpecificationDTO } from "../dto/specification/specification.dto";
import { Specification } from "../../domain/specification/specification.aggregate";
import { createSpecificationUsecase } from "../../application/specification/usecase/create-specification.usecase";

export async function createSpecificationAction(
  rawInput: CreateSpecificationInputDTO,
): Promise<ActionResult<SpecificationDTO>> {
  try {
    const authContext = await requireSsrAuth(["specifications:create"]);

    const createdCategory: Specification = await runUseCase({
      useCase: createSpecificationUsecase,
      input: rawInput,
      authContext,
    });

    return actionSuccess({ ...createdCategory });
  } catch (error) {
    return mapOperationErrorToActionResult(error);
  }
}
