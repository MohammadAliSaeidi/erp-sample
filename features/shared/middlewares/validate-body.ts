import { NextRequest, NextResponse } from "next/server";
import { z, type ZodType } from "zod";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import { JSONBodyValidationError } from "@/features/shared/errors/json-body-validation.error";
import { validateRequestJsonBody } from "@/features/shared/lib/validate-request-json-body";
import { Middleware } from "@/features/shared/types/middleware.type";

export const bodyValidator = <TSchema extends ZodType>(
  schema: TSchema,
): Middleware => {
  return <TContext = unknown>(handler: RouteHandler<TContext>) => {
    return async (request: NextRequest, context: TContext) => {
      try {
        const bodyPayload = await validateRequestJsonBody(request);
        const validatedBody = schema.parse(bodyPayload);
        const requestWithBody = Object.assign(request, {
          validatedBody,
        });

        return await handler(requestWithBody, context);
      } catch (error: unknown) {
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
