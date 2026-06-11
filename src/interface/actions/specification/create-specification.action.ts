"use server";

import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { specificationDeps } from "@/src/application/specification/composition/specification-deps";
import { buildCreateSpecificationRequest } from "@/src/application/specification/composition/specification-requests";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";
import { CreateSpecificationInputDTO } from "@/src/application/specification/dto/create-specification-input.dto";
import { SpecificationDTO } from "@/src/application/specification/dto/specification.dto";

export async function createSpecificationAction(
  rawInput: CreateSpecificationInputDTO,
): Promise<ActionResult<SpecificationDTO>> {
  try {
    const authContext = await requireSsrAuth();

    const runner = buildUsecaseRunner();
    const createdSpecification: SpecificationDTO = await runner.runWithInput(
      buildCreateSpecificationRequest(
        rawInput,
        buildStoreRequestContext(authContext),
        specificationDeps.create,
      ),
    );

    return actionSuccess(createdSpecification);
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
