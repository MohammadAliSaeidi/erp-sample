import { NextRequest } from "next/server";
import { JSONBodyValidationError } from "@/features/shared/errors/json-body-validation.error";

export async function validateRequestJsonBody<T = unknown>(
  request: NextRequest,
): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new JSONBodyValidationError("Invalid JSON body");
  }
}
