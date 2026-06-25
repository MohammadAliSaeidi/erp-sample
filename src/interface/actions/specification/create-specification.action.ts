"use server";

import { CreateSpecificationInputDTO } from "@/src/application/specification/dto/create-specification-input.dto";
import { SpecificationDTO } from "@/src/application/specification/dto/specification.dto";
import { createSpecificationUsecase } from "@/src/application/specification/usecase/create-specification.usecase";
import { ActionResult } from "@/src/interface/actions/map-usecase-error-to-action-result";
import { runAuthenticatedAction } from "@/src/interface/actions/run-authenticated-action";

export async function createSpecificationAction(
  rawInput: CreateSpecificationInputDTO,
): Promise<ActionResult<SpecificationDTO>> {
  const result = await runAuthenticatedAction({
    useCase: createSpecificationUsecase,
    input: rawInput,
  });

  if (!result.ok) return result;

  return { ok: true, data: { ...result.data } };
}
