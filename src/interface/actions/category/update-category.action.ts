"use server";



import { CategoryDTO } from "@/src/application/category/dto/category.dto";

import { EditCategoryInputDTO } from "@/src/application/category/dto/edit-category-input.dto";

import { updateCategoryUsecase } from "@/src/application/category/usecase/update-category.usecase";

import { ActionResult } from "@/src/interface/actions/map-usecase-error-to-action-result";

import { runAuthenticatedAction } from "@/src/interface/actions/run-authenticated-action";



export async function updateCategoryAction(

  rawInput: EditCategoryInputDTO,

): Promise<ActionResult<CategoryDTO>> {

  return runAuthenticatedAction({

    useCase: updateCategoryUsecase,

    input: rawInput,

  });

}

