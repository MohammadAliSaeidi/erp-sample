import { Middleware } from "@/features/shared/types/middleware.type";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import { WithValidatedBody } from "@/features/shared/types/next-request-with-validated-body";
import { NextRequest, NextResponse } from "next/server";
import { z, type ZodType } from "zod";
import { JSONBodyValidationError } from "@/features/shared/errors/json-body-validation.error";
import { validateRequestJsonBody } from "@/features/shared/lib/validate-request-json-body";

export const validateHttpBody = async <
  TBody = unknown,
  TSchema extends ZodType<TBody> = ZodType<TBody>,
>(
  schema: TSchema,
  request: NextRequest,
): Promise<TBody> => {
  const bodyPayload = await validateRequestJsonBody<TBody>(request);
  return schema.parse(bodyPayload);
};

export const httpBodyValidator = <
  TBody = unknown,
  TSchema extends ZodType<TBody> = ZodType<TBody>,
>(
  schema: TSchema,
): Middleware => {
  return <TContext = unknown>(handler: RouteHandler<TContext>) => {
    return async (
      request: NextRequest,
      context: TContext,
    ): Promise<Response | NextResponse> => {
      try {
        const validatedBody = await validateHttpBody<TBody, TSchema>(
          schema,
          request,
        );
        const requestWithValidatedBody = Object.assign(request, {
          validatedBody,
        }) as WithValidatedBody<TBody>;

        return handler(requestWithValidatedBody, context);
      } catch (error) {
        if (error instanceof JSONBodyValidationError) {
          return NextResponse.json(
            { error: "Invalid JSON Body" },
            { status: 400 },
          );
        }

        if (error instanceof z.ZodError) {
          return NextResponse.json(
            {
              error: "Validation failed",
              fields: z.treeifyError(error),
            },
            { status: 400 },
          );
        }

        throw error;
      }
    };
  };
};
