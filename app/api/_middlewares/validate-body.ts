import { NextRequest, NextResponse } from "next/server";
import { z, ZodTypeAny } from "zod";

type ApiHandler<TBody, TContext = unknown> = (
  req: NextRequest,
  ctx: TContext,
  body: TBody,
) => Promise<Response> | Response;

export function withValidatedBody<TSchema extends ZodTypeAny, TContext = unknown>(
  schema: TSchema,
  handler: ApiHandler<z.infer<TSchema>, TContext>,
) {
  return async (req: NextRequest, ctx: TContext): Promise<Response> => {
    let payload: unknown;

    try {
      payload = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    return handler(req, ctx, parsed.data);
  };
}
