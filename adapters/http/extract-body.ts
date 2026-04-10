import { BadRequestError } from "@/features/shared/errors/bad-request.error";
import { NextRequest } from "next/server";

export const extractBodyFromRequest = async <T = unknown>(
  request: NextRequest,
): Promise<T> => {
  return request.json() as Promise<T>;
};

export const extractBodyOrThrow = async <T = unknown>(
  request: NextRequest,
): Promise<T> => {
  const body = await extractBodyFromRequest<T>(request);
  if (!body) throw new BadRequestError();
  return body;
};
