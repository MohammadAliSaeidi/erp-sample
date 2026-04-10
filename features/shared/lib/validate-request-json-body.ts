import { NextRequest } from "next/server";
import { extractBodyFromRequest } from "@/adapters/http/extract-body";
import { JSONBodyValidationError } from "@/features/shared/errors/json-body-validation.error";

export async function validateRequestJsonBody<T>(
  request: NextRequest,
): Promise<T> {
  try {
    return await extractBodyFromRequest<T>(request);
  } catch {
    throw new JSONBodyValidationError("Invalid JSON Body");
  }
}
